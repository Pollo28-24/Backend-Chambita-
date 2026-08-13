import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePublicacionDto } from './dto/create-publicacion.dto';
import { UpdatePublicacionDto } from './dto/update-publicacion.dto';

@Injectable()
export class PublicacionesService {
  constructor(private prisma: PrismaService) {}

  async create(clienteId: string, dto: CreatePublicacionDto) {
    // RN-06: Inicia en estado ABIERTA por defecto
    return {
      id: 'stub-publicacion-id',
      clienteId,
      ...dto,
      estado: 'ABIERTA',
      createdAt: new Date(),
    };
  }

  async findAll(query: { oficioId?: string; categoriaId?: string; ubicacion?: string; estado?: string }) {
    return [];
  }

  async findOne(id: string) {
    return { id, titulo: 'Solicitud Reparación' };
  }

  async findMyPublications(clienteId: string) {
    return [];
  }

  async update(id: string, clienteId: string, dto: UpdatePublicacionDto) {
    // RN-07: Solo el propietario modifica su publicación
    // RN-08: COMPLETADA no se edita libremente
    return { id, clienteId, ...dto };
  }

  async remove(id: string, clienteId: string) {
    return { id, message: 'Publicación eliminada exitosamente' };
  }
}
