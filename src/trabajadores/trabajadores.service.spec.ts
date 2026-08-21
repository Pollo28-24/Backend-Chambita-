import { Test, TestingModule } from '@nestjs/testing';
import { TrabajadoresService } from './trabajadores.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException } from '@nestjs/common';

describe('TrabajadoresService', () => {
  let service: TrabajadoresService;

  const mockPerfilTrabajador = {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    findFirst: jest.fn(),
    count: jest.fn(),
    update: jest.fn(),
  };

  const mockTrabajadorOficio = {
    deleteMany: jest.fn(),
    createMany: jest.fn(),
  };

  const mockOficio = {
    findMany: jest.fn(),
  };

  const mockPrismaService = {
    perfilTrabajador: mockPerfilTrabajador,
    trabajadorOficio: mockTrabajadorOficio,
    oficio: mockOficio,
    $transaction: jest.fn(),
  };

  beforeEach(async () => {
    mockPrismaService.$transaction.mockImplementation(
      (cb: (tx: typeof mockPrismaService) => Promise<unknown>) =>
        cb(mockPrismaService),
    );

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TrabajadoresService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<TrabajadoresService>(TrabajadoresService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('assignOficios', () => {
    it('should throw BadRequestException if assigning more than 3 principal oficios', async () => {
      await expect(
        service.assignOficios('worker-id', {
          oficios: [
            { oficioId: 'oficio-1', principal: true },
            { oficioId: 'oficio-2', principal: true },
            { oficioId: 'oficio-3', principal: true },
            { oficioId: 'oficio-4', principal: true },
          ],
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if one or more assigned oficios do not exist or are inactive', async () => {
      mockPerfilTrabajador.findUnique.mockResolvedValue({ id: 'perfil-id' });
      mockOficio.findMany.mockResolvedValue([
        { id: 'oficio-1', activo: true },
      ]); // Sólo se encuentra 1 oficio activo de los 2 asignados

      await expect(
        service.assignOficios('worker-id', {
          oficios: [
            { oficioId: 'oficio-1', principal: true },
            { oficioId: 'oficio-2', principal: false },
          ],
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should allow assigning 3 or fewer principal oficios', async () => {
      mockPerfilTrabajador.findUnique.mockResolvedValue({ id: 'perfil-id' });
      mockOficio.findMany.mockResolvedValue([
        { id: 'oficio-1', activo: true },
        { id: 'oficio-2', activo: true },
        { id: 'oficio-3', activo: true },
      ]);

      const result = await service.assignOficios('worker-id', {
        oficios: [
          { oficioId: 'oficio-1', principal: true },
          { oficioId: 'oficio-2', principal: true },
          { oficioId: 'oficio-3', principal: false },
        ],
      });

      expect(result).toBeDefined();
    });
  });

  describe('findAll', () => {
    it('should filter workers by category and availability', async () => {
      mockPerfilTrabajador.count.mockResolvedValue(0);
      mockPerfilTrabajador.findMany.mockResolvedValue([]);
      mockPrismaService.$transaction.mockResolvedValueOnce([0, []]);

      await service.findAll({
        categoriaId: 'categoria-id',
        disponible: true,
        page: 1,
        limit: 10,
      });

      const expectedWhere = {
        disponible: true,
        oficios: {
          some: {
            oficio: { categoriaId: 'categoria-id' },
          },
        },
      };

      expect(mockPerfilTrabajador.count).toHaveBeenCalledWith({
        where: expect.objectContaining(expectedWhere),
      });
      expect(mockPerfilTrabajador.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining(expectedWhere),
        }),
      );
    });
  });
});
