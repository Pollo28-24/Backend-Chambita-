import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateResenaDto } from './dto/create-resena.dto';

@Injectable()
export class ResenasService {
  constructor(private prisma: PrismaService) {}

  async create(clienteId: string, dto: CreateResenaDto) {
    // RN-09: Validar rango 1 a 5
    if (dto.calificacion < 1 || dto.calificacion > 5) {
      throw new BadRequestException('La calificación debe estar entre 1 y 5 estrellas');
    }
    // RN-10: Validar que el cliente no sea la misma persona que el trabajador
    if (clienteId === dto.trabajadorId) {
      throw new BadRequestException('Un cliente no puede autocalificarse');
    }

    return {
      id: 'stub-resena-id',
      clienteId,
      ...dto,
      createdAt: new Date(),
    };
  }

  async findByTrabajador(trabajadorId: string) {
    return [];
  }

  async getResumenTrabajador(trabajadorId: string) {
    return {
      trabajadorId,
      promedioCalificacion: 4.8,
      totalResenas: 12,
    };
  }
}
