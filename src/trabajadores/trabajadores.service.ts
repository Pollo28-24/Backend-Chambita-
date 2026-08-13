import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdatePerfilDto } from './dto/update-perfil.dto';
import { AssignOficiosDto } from './dto/assign-oficios.dto';

@Injectable()
export class TrabajadoresService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: { oficioId?: string; categoriaId?: string; zona?: string; disponible?: boolean }) {
    return [];
  }

  async findOne(id: string) {
    return { id, perfil: {} };
  }

  async updatePerfil(usuarioId: string, dto: UpdatePerfilDto) {
    return { usuarioId, ...dto };
  }

  async assignOficios(usuarioId: string, dto: AssignOficiosDto) {
    // RN-03: Validar que no se asignen más de 3 oficios principales
    const principales = dto.oficios.filter((o) => o.principal).length;
    if (principales > 3) {
      throw new BadRequestException('Un trabajador solo puede tener un máximo de 3 oficios principales');
    }
    return { usuarioId, oficios: dto.oficios };
  }
}
