import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';

@Injectable()
export class CategoriasService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCategoriaDto) {
    return this.prisma.categoria.create({
      data: dto,
    });
  }

  async findAll() {
    return this.prisma.categoria.findMany({
      where: { activo: true },
    });
  }

  async findOne(id: string) {
    const categoria = await this.prisma.categoria.findUnique({
      where: { id },
    });
    if (!categoria) {
      throw new NotFoundException('Categoría no encontrada');
    }
    return categoria;
  }

  async update(id: string, dto: UpdateCategoriaDto) {
    await this.findOne(id);
    return this.prisma.categoria.update({
      where: { id },
      data: dto,
    });
  }

  // RN-15: Preferir baja lógica en catálogos
  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.categoria.update({
      where: { id },
      data: { activo: false },
    });
  }
}
