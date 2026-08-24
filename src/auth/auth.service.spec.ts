import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeAll(() => {
    process.env.JWT_SECRET = 'test-jwt-secret';
  });

  const mockPrismaService = {
    usuario: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
    },
    refreshToken: {
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
    },
  };

  const mockJwtService = {
    signAsync: jest.fn(),
    verifyAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should rotate refresh token and revoke the used one', async () => {
    const token = 'refresh-token-123';
    const hashedOldToken = await bcrypt.hash(token, 10);
    const newToken = 'new-refresh-token-456';

    mockJwtService.verifyAsync.mockResolvedValue({
      sub: 'user-1',
      email: 'user@test.com',
      rol: 'CLIENTE',
    });
    mockPrismaService.refreshToken.findMany.mockResolvedValue([
      {
        id: 'rt-1',
        usuarioId: 'user-1',
        revokedAt: null,
        expiresAt: new Date(Date.now() + 10000),
        tokenHash: hashedOldToken,
      },
    ]);
    mockJwtService.signAsync.mockResolvedValueOnce('new-access-token');
    mockJwtService.signAsync.mockResolvedValueOnce(newToken);
    mockPrismaService.refreshToken.update.mockResolvedValue({ id: 'rt-1' });
    mockPrismaService.refreshToken.create.mockResolvedValue({ id: 'rt-2' });

    const result = await service.refreshToken(token);

    expect(result.accessToken).toBe('new-access-token');
    expect(result.refreshToken).toBe(newToken);
    expect(mockPrismaService.refreshToken.update).toHaveBeenCalledWith({
      where: { id: 'rt-1' },
      data: { revokedAt: expect.any(Date) },
    });
    expect(mockPrismaService.refreshToken.create).toHaveBeenCalled();
  });

  it('should reject refresh when token is not present in database', async () => {
    mockJwtService.verifyAsync.mockResolvedValue({
      sub: 'user-1',
      email: 'user@test.com',
      rol: 'CLIENTE',
    });
    mockPrismaService.refreshToken.findMany.mockResolvedValue([]);

    await expect(service.refreshToken('unknown-token')).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
