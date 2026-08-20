import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePublicacionDto } from './dto/create-publicacion.dto';
import { UpdatePublicacionDto } from './dto/update-publicacion.dto';
import { PublicacionEstado } from '@prisma/client';

@Injectable()
export class PublicacionesService {
  constructor(private prisma: PrismaService) {}

  async create(clienteId: string, dto: CreatePublicacionDto) {
    // RN-04: Solo clientes crean publicaciones
    const user = await this.prisma.usuario.findUnique({
      where: { id: clienteId },
    });
    if (!user || user.rol !== 'CLIENTE') {
      throw new ForbiddenException(
        'Solo los usuarios con rol CLIENTE pueden crear publicaciones',
      );
    }

    // RN-05: Publicación ligada a oficio activo
    const oficio = await this.prisma.oficio.findUnique({
      where: { id: dto.oficioId },
    });
    if (!oficio || !oficio.activo) {
      throw new BadRequestException(
        'El oficio seleccionado no existe o no está activo',
      );
    }

    // RN-06: Inicia en estado ABIERTA por defecto
    return this.prisma.publicacion.create({
      data: {
        clienteId,
        oficioId: dto.oficioId,
        titulo: dto.titulo,
        descripcion: dto.descripcion,
        ubicacion: dto.ubicacion,
        presupuesto: dto.presupuesto,
        estado: 'ABIERTA',
      },
    });
  }

  async findAll(query: {
    oficioId?: string;
    categoriaId?: string;
    ubicacion?: string;
    estado?: string;
  }) {
    return this.prisma.publicacion.findMany({
      where: {
        oficioId: query.oficioId || undefined,
        oficio: query.categoriaId
          ? { categoriaId: query.categoriaId }
          : undefined,
        ubicacion: query.ubicacion ? { contains: query.ubicacion } : undefined,
        estado: query.estado ? (query.estado as PublicacionEstado) : undefined,
      },
      include: {
        cliente: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            telefono: true,
            fotoUrl: true,
          },
        },
        oficio: {
          include: {
            categoria: true,
          },
        },
        resena: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const publicacion = await this.prisma.publicacion.findUnique({
      where: { id },
      include: {
        cliente: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            telefono: true,
            fotoUrl: true,
          },
        },
        oficio: {
          include: {
            categoria: true,
          },
        },
        resena: true,
      },
    });

    if (!publicacion) {
      throw new NotFoundException('Publicación no encontrada');
    }
    return publicacion;
  }

  async findMyPublications(clienteId: string) {
    return this.prisma.publicacion.findMany({
      where: { clienteId },
      include: {
        oficio: {
          include: {
            categoria: true,
          },
        },
        resena: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async update(id: string, clienteId: string, dto: UpdatePublicacionDto) {
    const publicacion = await this.findOne(id);

    // RN-07: Solo el propietario modifica su publicación
    if (publicacion.clienteId !== clienteId) {
      throw new ForbiddenException(
        'No tiene permisos para modificar esta publicación',
      );
    }

    // RN-08: COMPLETADA no se edita libremente
    if (publicacion.estado === 'COMPLETADA') {
      throw new BadRequestException(
        'Las publicaciones completadas no pueden ser editadas',
      );
    }

    return this.prisma.publicacion.update({
      where: { id },
      data: {
        titulo: dto.titulo,
        descripcion: dto.descripcion,
        ubicacion: dto.ubicacion,
        presupuesto: dto.presupuesto,
        estado: dto.estado ? dto.estado : undefined,
      },
    });
  }

  async remove(id: string, clienteId: string) {
    const publicacion = await this.findOne(id);

    // RN-07: Solo el propietario modifica (o elimina) su publicación
    if (publicacion.clienteId !== clienteId) {
      throw new ForbiddenException(
        'No tiene permisos para eliminar esta publicación',
      );
    }

    await this.prisma.publicacion.delete({
      where: { id },
    });

    return { id, message: 'Publicación eliminada exitosamente' };
  }
}
