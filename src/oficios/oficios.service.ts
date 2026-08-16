import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOficioDto } from './dto/create-oficio.dto';
import { UpdateOficioDto } from './dto/update-oficio.dto';

@Injectable()
export class OficiosService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateOficioDto) {
    return { id: 'stub-oficio-id', ...dto, activo: true };
  }

  async findAll(categoriaId?: string) {
    return [];
  }

  async findOne(id: string) {
    return { id, nombre: 'Plomería' };
  }

  async update(id: string, dto: UpdateOficioDto) {
    return { id, ...dto };
  }

  async remove(id: string) {
    return { id, activo: false, message: 'Oficio desactivado exitosamente (baja lógica)' };
  }
}
