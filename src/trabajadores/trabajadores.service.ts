import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdatePerfilDto } from './dto/update-perfil.dto';
import { AssignOficiosDto } from './dto/assign-oficios.dto';

@Injectable()
export class TrabajadoresService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: {
    oficioId?: string;
    categoriaId?: string;
    zona?: string;
    disponible?: boolean;
  }) {
    return this.prisma.perfilTrabajador.findMany({
      where: {
        disponible:
          query.disponible !== undefined ? query.disponible : undefined,
        zonaCobertura: query.zona ? { contains: query.zona } : undefined,
        oficios:
          query.oficioId || query.categoriaId
            ? {
                some: {
                  oficioId: query.oficioId || undefined,
                  oficio: query.categoriaId
                    ? {
                        categoriaId: query.categoriaId,
                      }
                    : undefined,
                },
              }
            : undefined,
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
