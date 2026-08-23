import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePublicacionDto } from './dto/create-publicacion.dto';
import { UpdatePublicacionDto } from './dto/update-publicacion.dto';
import { Prisma } from '@prisma/client';
import { PublicacionQueryDto } from './dto/publicacion-query.dto';

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
      include: {
        categoria: {
          select: { activo: true },
        },
      },
    });
    if (!oficio || !oficio.activo || !oficio.categoria.activo) {
      throw new BadRequestException(
        'El oficio seleccionado no existe o su categoría no está activa',
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

  async findAll(query: PublicacionQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: Prisma.PublicacionWhereInput = {
      oficioId: query.oficioId || undefined,
      oficio: query.categoriaId
        ? { categoriaId: query.categoriaId }
        : undefined,
      estado: query.estado || undefined,
      ubicacion: query.ubicacion
        ? { contains: query.ubicacion }
        : undefined,
      presupuesto:
        query.presupuestoMin !== undefined || query.presupuestoMax !== undefined
          ? {
              gte: query.presupuestoMin,
              lte: query.presupuestoMax,
            }
          : undefined,
      OR: query.busqueda
        ? [
            { titulo: { contains: query.busqueda } },
            { descripcion: { contains: query.busqueda } },
          ]
        : undefined,
    };

    const [total, data] = await this.prisma.$transaction([
      this.prisma.publicacion.count({ where }),
      this.prisma.publicacion.findMany({
        where,
        skip,
        take: limit,
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
      }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
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

    if (dto.estado) {
      const transicionesValidas: Record<string, string[]> = {
        ABIERTA: ['EN_PROGRESO'],
        EN_PROGRESO: ['COMPLETADA'],
        COMPLETADA: [],
      };

      const estadoActual = publicacion.estado;
      const siguienteEstado = dto.estado;
      const estadosPermitidos = transicionesValidas[estadoActual] ?? [];

      if (
        estadoActual !== siguienteEstado &&
        !estadosPermitidos.includes(siguienteEstado)
      ) {
        throw new BadRequestException(
          `No se puede cambiar el estado de ${estadoActual} a ${siguienteEstado}.`+
            ' La secuencia válida es ABIERTA -> EN_PROGRESO -> COMPLETADA.',
        );
      }
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
