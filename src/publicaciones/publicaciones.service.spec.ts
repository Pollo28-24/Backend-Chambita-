import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { PublicacionesService } from './publicaciones.service';
import { PrismaService } from '../prisma/prisma.service';

describe('PublicacionesService', () => {
  let service: PublicacionesService;

  const mockPrismaService = {
    usuario: { findUnique: jest.fn() },
    oficio: { findUnique: jest.fn() },
    publicacion: { create: jest.fn() },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PublicacionesService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<PublicacionesService>(PublicacionesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should reject an oficio whose category is inactive', async () => {
    mockPrismaService.usuario.findUnique.mockResolvedValue({ rol: 'CLIENTE' });
    mockPrismaService.oficio.findUnique.mockResolvedValue({
      activo: true,
      categoria: { activo: false },
    });

    await expect(
      service.create('cliente-id', {
        oficioId: 'oficio-id',
        titulo: 'Reparación de fuga',
        descripcion: 'Reparar una fuga en casa',
        ubicacion: 'Oaxaca Centro',
      }),
    ).rejects.toThrow(BadRequestException);
  });
});