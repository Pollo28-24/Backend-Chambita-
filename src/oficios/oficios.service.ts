import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOficioDto } from './dto/create-oficio.dto';
import { UpdateOficioDto } from './dto/update-oficio.dto';

@Injectable()
export class OficiosService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateOficioDto) {
    return this.prisma.oficio.create({
      data: dto,
    });
  }

  async findAll(categoriaId?: string) {
    return this.prisma.oficio.findMany({
      where: {
        activo: true,
        categoriaId: categoriaId || undefined,
      },
      include: {
        categoria: true,
      },
    });
  }

  async findOne(id: string) {
    const oficio = await this.prisma.oficio.findUnique({
      where: { id },
      include: {
        categoria: true,
      },
    });
    if (!oficio) {
      throw new NotFoundException('Oficio no encontrado');
    }
    return oficio;
  }

  async update(id: string, dto: UpdateOficioDto) {
    await this.findOne(id);
    return this.prisma.oficio.update({
      where: { id },
      data: dto,
    });
  }

  // RN-15: Preferir baja lógica en catálogos
  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.oficio.update({
      where: { id },
      data: { activo: false },
    });
  }
}
