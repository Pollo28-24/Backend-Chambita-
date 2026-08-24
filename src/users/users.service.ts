import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.usuario.findUnique({
      where: { id: userId },
      include: {
        perfilTrabajador: {
          include: {
            oficios: {
              include: {
                oficio: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const result = { ...user };
    delete (result as { passwordHash?: string }).passwordHash;
    return result;
  }

  async updateProfile(userId: string, dto: UpdateUserDto) {
    if (dto.telefono) {
      const existingPhoneUser = await this.prisma.usuario.findUnique({
        where: { telefono: dto.telefono },
      });

      if (existingPhoneUser && existingPhoneUser.id !== userId) {
        throw new Error('El número de teléfono ya está registrado por otro usuario');
      }
    }

    const user = await this.prisma.usuario.update({
      where: { id: userId },
      data: dto,
    });

    const result = { ...user };
    delete (result as { passwordHash?: string }).passwordHash;
    return result;
  }
}
