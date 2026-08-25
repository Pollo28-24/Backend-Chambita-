import { IsOptional, IsString, IsEnum, IsNumber, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PublicacionEstado } from '@prisma/client';

export class PublicacionQueryDto {
  @ApiPropertyOptional({
    description: 'Palabra clave para buscar en título o descripción.',
    example: 'plomería urgente',
  })
  @IsOptional()
  @IsString()
  busqueda?: string;

  @ApiPropertyOptional({
    description: 'ID de la categoría del oficio.',
    example: 'cat-1',
  })
  @IsOptional()
  @IsString()
  categoriaId?: string;

  @ApiPropertyOptional({
    description: 'ID del oficio asociado a la publicación.',
    example: 'oficio-1',
  })
  @IsOptional()
  @IsString()
  oficioId?: string;

  @ApiPropertyOptional({
    description: 'Estado de la publicación.',
    enum: PublicacionEstado,
    example: PublicacionEstado.ABIERTA,
  })
  @IsOptional()
  @IsEnum(PublicacionEstado)
  estado?: PublicacionEstado;

  @ApiPropertyOptional({
    description: 'Presupuesto mínimo para filtrar publicaciones.',
    example: 150,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'presupuestoMin must be a number' })
  presupuestoMin?: number;

  @ApiPropertyOptional({
    description: 'Presupuesto máximo para filtrar publicaciones.',
    example: 1200,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'presupuestoMax must be a number' })
  presupuestoMax?: number;

  @ApiPropertyOptional({
    description: 'Texto de ubicación para filtrar.',
    example: 'Guadalajara',
  })
  @IsOptional()
  @IsString()
  ubicacion?: string;

  @ApiPropertyOptional({
    description: 'Número de página.',
    example: 1,
    default: 1,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Cantidad de resultados por página.',
    example: 10,
    default: 10,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;
}
