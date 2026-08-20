import { Test, TestingModule } from '@nestjs/testing';
import { ResenasService } from './resenas.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException } from '@nestjs/common';

describe('ResenasService', () => {
  let service: ResenasService;

  const mockPrismaService = {
    publicacion: {
      findUnique: jest.fn(),
    },
    resena: {
      findUnique: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
      aggregate: jest.fn(),
    },
    usuario: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResenasService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ResenasService>(ResenasService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should throw BadRequestException if calificacion is less than 1', async () => {
      await expect(
        service.create('cliente-id', {
          trabajadorId: 'trabajador-id',
          publicacionId: 'pub-id',
          calificacion: 0,
          comentario: 'malo',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if calificacion is greater than 5', async () => {
      await expect(
        service.create('cliente-id', {
          trabajadorId: 'trabajador-id',
          publicacionId: 'pub-id',
          calificacion: 6,
          comentario: 'excelente',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if cliente tries to rate themselves', async () => {
      await expect(
        service.create('same-id', {
          trabajadorId: 'same-id',
          publicacionId: 'pub-id',
          calificacion: 5,
          comentario: 'autoresena',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
