import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async register(dto: RegisterDto) {
    // Stub de registro usando PrismaService
    return {
      message: 'Usuario registrado exitosamente',
      user: { email: dto.email, rol: dto.rol },
    };
  }

  async login(dto: LoginDto) {
    // Stub de autenticación
    return {
      accessToken: 'stub-jwt-token',
      refreshToken: 'stub-refresh-token',
    };
  }

  async refreshToken(refreshToken: string) {
    return {
      accessToken: 'stub-new-jwt-token',
    };
  }
}
