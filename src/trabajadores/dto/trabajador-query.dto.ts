import { IsOptional, IsString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class TrabajadorQueryDto {
  @ApiPropertyOptional({
    description: 'Palabra clave para buscar por nombre, apellido o descripción.',
    example: 'electricista',
  })
  @IsOptional()
  @IsString()
  busqueda?: string;

  @ApiPropertyOptional({
    description: 'ID del oficio del trabajador.',
    example: 'oficio-1',
  })
  @IsOptional()
  @IsString()
  oficioId?: string;

  @ApiPropertyOptional({
    description: 'Texto para filtrar por zona de cobertura.',
    example: 'Zapopan',
  })
  @IsOptional()
  @IsString()
  zonaCobertura?: string;

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
