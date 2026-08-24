import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { getJwtSecret } from '../common/config/jwt-secret';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    // Verificar si el email ya existe
    const emailExist = await this.prisma.usuario.findUnique({
      where: { email: dto.email },
    });
    if (emailExist) {
      throw new ConflictException('El correo electrónico ya está registrado');
    }

    // Verificar si el teléfono ya existe
    const telefonoExist = await this.prisma.usuario.findUnique({
      where: { telefono: dto.telefono },
    });
    if (telefonoExist) {
      throw new ConflictException('El número de teléfono ya está registrado');
    }

    // Hash de la contraseña
    const passwordHash = await bcrypt.hash(dto.password, 10);

    // Crear usuario y opcionalmente su perfil
    const user = await this.prisma.$transaction(async (tx) => {
      const createdUser = await tx.usuario.create({
        data: {
          nombre: dto.nombre,
          apellido: dto.apellido,
          email: dto.email,
          telefono: dto.telefono,
          passwordHash,
          rol: dto.rol,
          fotoUrl: dto.fotoUrl,
        },
      });

      // RN-02: Solo trabajadores tienen perfil. Si es TRABAJADOR, creamos su perfil
      if (dto.rol === 'TRABAJADOR') {
        await tx.perfilTrabajador.create({
          data: {
            usuarioId: createdUser.id,
            descripcion: dto.descripcion,
            experiencia: dto.experiencia,
            zonaCobertura: dto.zonaCobertura || 'General',
          },
        });
      }

      return createdUser;
    });

    const result = { ...user };
    delete (result as { passwordHash?: string }).passwordHash;
    return result;
  }

  async login(dto: LoginDto) {
    if (!dto.email && !dto.telefono) {
      throw new BadRequestException(
        'Debe proporcionar un correo electrónico o un número de teléfono',
      );
    }

    // Buscar el usuario
    const conditions: { email?: string; telefono?: string }[] = [];
    if (dto.email) conditions.push({ email: dto.email });
    if (dto.telefono) conditions.push({ telefono: dto.telefono });

    const user = await this.prisma.usuario.findFirst({
      where: {
        OR: conditions,
      },
    });

    if (!user || !user.activo) {
      throw new UnauthorizedException(
        'Credenciales incorrectas o cuenta inactiva',
      );
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(
      dto.password,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    // Generar Tokens
    const payload = { sub: user.id, email: user.email, rol: user.rol };
    const accessToken = await this.jwtService.signAsync(payload);

    // Generar Refresh Token
    const refreshTokenValue = await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
    });
    const refreshTokenHash = await bcrypt.hash(refreshTokenValue, 10);

    // Guardar Refresh Token en BD
    await this.prisma.refreshToken.create({
      data: {
        usuarioId: user.id,
        tokenHash: refreshTokenHash,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días
      },
    });

    const userWithoutPassword = { ...user };
    delete (userWithoutPassword as { passwordHash?: string }).passwordHash;

    return {
      accessToken,
      refreshToken: refreshTokenValue,
      user: userWithoutPassword,
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = (await this.jwtService.verifyAsync(refreshToken, {
        secret: getJwtSecret(),
      })) as unknown as { sub: string; email: string; rol: string };

      const dbTokens = await this.prisma.refreshToken.findMany({
        where: {
          usuarioId: payload.sub,
          revokedAt: null,
          expiresAt: { gt: new Date() },
        },
      });

      let matchedToken: { id: string; tokenHash: string } | null = null;
      for (const token of dbTokens) {
        const isMatched = await bcrypt.compare(refreshToken, token.tokenHash);
        if (isMatched) {
          matchedToken = token;
          break;
        }
      }

      if (!matchedToken) {
        throw new UnauthorizedException('Refresh token inválido o revocado');
      }

      const newPayload = {
        sub: payload.sub,
        email: payload.email,
        rol: payload.rol,
      };

      const accessToken = await this.jwtService.signAsync(newPayload);
      const newRefreshTokenValue = await this.jwtService.signAsync(newPayload, {
        expiresIn: '7d',
      });
      const newRefreshTokenHash = await bcrypt.hash(newRefreshTokenValue, 10);

      await this.prisma.refreshToken.update({
        where: { id: matchedToken.id },
        data: { revokedAt: new Date() },
      });

      await this.prisma.refreshToken.create({
        data: {
          usuarioId: payload.sub,
          tokenHash: newRefreshTokenHash,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });

      return { accessToken, refreshToken: newRefreshTokenValue };
    } catch {
      throw new UnauthorizedException('Refresh token expirado o inválido');
    }
  }

  async logout(userId: string, refreshToken?: string) {
    if (refreshToken) {
      // Intentar revocar el refresh token específico
      const dbTokens = await this.prisma.refreshToken.findMany({
        where: { usuarioId: userId, revokedAt: null },
      });

      for (const token of dbTokens) {
        const isMatched = await bcrypt.compare(refreshToken, token.tokenHash);
        if (isMatched) {
          await this.prisma.refreshToken.update({
            where: { id: token.id },
            data: { revokedAt: new Date() },
          });
          break;
        }
      }
    } else {
      // Revocar todos si no se pasa uno específico
      await this.prisma.refreshToken.updateMany({
        where: { usuarioId: userId, revokedAt: null },
        data: { revokedAt: new Date() },
      });
    }

    return { message: 'Sesión cerrada exitosamente' };
  }
}
