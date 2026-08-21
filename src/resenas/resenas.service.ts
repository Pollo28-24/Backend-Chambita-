import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateResenaDto } from './dto/create-resena.dto';

@Injectable()
export class ResenasService {
  constructor(private prisma: PrismaService) {}

  async create(clienteId: string, dto: CreateResenaDto) {
    // RN-09: Validar rango 1 a 5
    if (dto.calificacion < 1 || dto.calificacion > 5) {
      throw new BadRequestException(
        'La calificación debe estar entre 1 y 5 estrellas',
      );
    }

    // RN-10: Validar que el cliente no sea la misma persona que el trabajador
    if (clienteId === dto.trabajadorId) {
      throw new BadRequestException('Un cliente no puede autocalificarse');
    }

    // Verificar que la publicación existe y pertenece al cliente
    const publicacion = await this.prisma.publicacion.findUnique({
      where: { id: dto.publicacionId },
    });
    if (!publicacion) {
      throw new NotFoundException('Publicación no encontrada');
    }
    if (publicacion.clienteId !== clienteId) {
      throw new ForbiddenException(
        'Solo el cliente propietario de la publicación puede calificar',
      );
    }
    if (publicacion.estado !== 'COMPLETADA') {
      throw new BadRequestException(
        'Solo se pueden calificar publicaciones completadas',
      );
    }

    // Verificar que no se haya calificado antes la publicación
    const resenaExistente = await this.prisma.resena.findUnique({
      where: { publicacionId: dto.publicacionId },
    });
    if (resenaExistente) {
      throw new BadRequestException(
        'Esta publicación ya cuenta con una calificación',
      );
    }

    // Verificar que el trabajador calificado existe
    const trabajador = await this.prisma.usuario.findUnique({
      where: { id: dto.trabajadorId },
    });
    if (!trabajador || trabajador.rol !== 'TRABAJADOR') {
      throw new BadRequestException(
        'El usuario calificado no existe o no tiene rol de TRABAJADOR',
      );
    }

    return this.prisma.resena.create({
      data: {
        clienteId,
        trabajadorId: dto.trabajadorId,
        publicacionId: dto.publicacionId,
        calificacion: dto.calificacion,
        comentario: dto.comentario,
      },
    });
  }

  async findByTrabajador(trabajadorId: string) {
    return this.prisma.resena.findMany({
      where: { trabajadorId },
      include: {
        cliente: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            fotoUrl: true,
          },
        },
        publicacion: {
          select: {
            id: true,
            titulo: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // RN-14: Promedio con AVG()
  async getResumenTrabajador(trabajadorId: string) {
    const aggregate = await this.prisma.resena.aggregate({
      where: { trabajadorId },
      _avg: {
        calificacion: true,
      },
      _count: {
        id: true,
      },
    });

    return {
      trabajadorId,
      promedioCalificacion: aggregate._avg.calificacion
        ? parseFloat(aggregate._avg.calificacion.toFixed(2))
        : 0,
      totalResenas: aggregate._count.id,
    };
  }
}
