import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UpdatePerfilDto } from './dto/update-perfil.dto';
import { AssignOficiosDto } from './dto/assign-oficios.dto';
import { TrabajadorQueryDto } from './dto/trabajador-query.dto';

@Injectable()
export class TrabajadoresService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: TrabajadorQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: Prisma.PerfilTrabajadorWhereInput = {
      disponible: query.disponible,
      zonaCobertura: query.zonaCobertura
        ? { contains: query.zonaCobertura }
        : undefined,
      oficios:
        query.oficioId || query.categoriaId
          ? {
              some: {
                oficioId: query.oficioId,
                oficio: query.categoriaId
                  ? { categoriaId: query.categoriaId }
                  : undefined,
              },
            }
          : undefined,
      OR: query.busqueda
        ? [
            { descripcion: { contains: query.busqueda } },
            {
              usuario: {
                is: {
                  nombre: { contains: query.busqueda },
                },
              },
            },
            {
              usuario: {
                is: {
                  apellido: { contains: query.busqueda },
                },
              },
            },
          ]
        : undefined,
    };

    const [total, data] = await this.prisma.$transaction([
      this.prisma.perfilTrabajador.count({ where }),
      this.prisma.perfilTrabajador.findMany({
        where,
        skip,
        take: limit,
        include: {
          usuario: {
            select: {
              id: true,
              nombre: true,
              apellido: true,
              email: true,
              telefono: true,
              fotoUrl: true,
            },
          },
          oficios: {
            include: {
              oficio: true,
            },
          },
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
    const perfil = await this.prisma.perfilTrabajador.findFirst({
      where: {
        OR: [{ id }, { usuarioId: id }],
      },
      include: {
        usuario: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            email: true,
            telefono: true,
            fotoUrl: true,
          },
        },
        oficios: {
          include: {
            oficio: true,
          },
        },
      },
    });

    if (!perfil) {
      throw new NotFoundException('Perfil de trabajador no encontrado');
    }
    return perfil;
  }

  async updatePerfil(usuarioId: string, dto: UpdatePerfilDto) {
    const perfil = await this.prisma.perfilTrabajador.findUnique({
      where: { usuarioId },
    });
    if (!perfil) {
      throw new NotFoundException('Perfil de trabajador no encontrado');
    }

    return this.prisma.perfilTrabajador.update({
      where: { usuarioId },
      data: dto,
    });
  }

  async assignOficios(usuarioId: string, dto: AssignOficiosDto) {
    // RN-03: Validar que no se asignen más de 3 oficios principales
    const principales = dto.oficios.filter((o) => o.principal).length;
    if (principales > 3) {
      throw new BadRequestException(
        'Un trabajador solo puede tener un máximo de 3 oficios principales',
      );
    }

    const perfil = await this.prisma.perfilTrabajador.findUnique({
      where: { usuarioId },
    });
    if (!perfil) {
      throw new NotFoundException('Perfil de trabajador no encontrado');
    }

    // Validar que todos los oficios que se van a asignar existen y están activos
    if (dto.oficios.length > 0) {
      const oficiosIds = dto.oficios.map((o) => o.oficioId);
      const oficiosExistentes = await this.prisma.oficio.findMany({
        where: {
          id: { in: oficiosIds },
          activo: true,
        },
      });

      if (oficiosExistentes.length !== oficiosIds.length) {
        throw new BadRequestException(
          'Uno o más oficios asignados no existen o no están activos',
        );
      }
    }

    return this.prisma.$transaction(async (tx) => {
      // Borrar oficios anteriores
      await tx.trabajadorOficio.deleteMany({
        where: { trabajadorId: perfil.id },
      });

      // Crear nuevos
      if (dto.oficios.length > 0) {
        await tx.trabajadorOficio.createMany({
          data: dto.oficios.map((o) => ({
            trabajadorId: perfil.id,
            oficioId: o.oficioId,
            principal: o.principal,
          })),
        });
      }

      return tx.perfilTrabajador.findUnique({
        where: { id: perfil.id },
        include: {
          oficios: {
            include: {
              oficio: true,
            },
          },
        },
      });
    });
  }
}
