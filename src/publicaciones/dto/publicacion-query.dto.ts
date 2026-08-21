import { IsOptional, IsString, IsEnum, IsNumber, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { PublicacionEstado } from '@prisma/client';

export class PublicacionQueryDto {
  @IsOptional()
  @IsString()
  busqueda?: string;

  @IsOptional()
  @IsString()
  categoriaId?: string;

  @IsOptional()
  @IsString()
  oficioId?: string;

  @IsOptional()
  @IsEnum(PublicacionEstado)
  estado?: PublicacionEstado;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'presupuestoMin must be a number' })
  presupuestoMin?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'presupuestoMax must be a number' })
  presupuestoMax?: number;

  @IsOptional()
  @IsString()
  ubicacion?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;
}
