import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';

@Injectable()
export class CategoriasService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCategoriaDto) {
    return { id: 'stub-id', ...dto, activo: true };
  }

  async findAll() {
    return [];
  }

  async findOne(id: string) {
    return { id, nombre: 'Categoría Ejemplo' };
  }

  async update(id: string, dto: UpdateCategoriaDto) {
    return { id, ...dto };
  }

  // RN-15: Preferir baja lógica
  async remove(id: string) {
    return { id, activo: false, message: 'Categoría desactivada exitosamente (baja lógica)' };
  }
}
