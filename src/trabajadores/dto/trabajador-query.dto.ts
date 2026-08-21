import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsOptional, IsString, IsInt, Min } from 'class-validator';

export class TrabajadorQueryDto {
  @IsOptional()
  @IsString()
  busqueda?: string;

  @IsOptional()
  @IsString()
  oficioId?: string;

  @IsOptional()
  @IsString()
  categoriaId?: string;

  @IsOptional()
  @IsString()
  zonaCobertura?: string;

  @IsOptional()
  @Transform(({ value }) => value === true || value === 'true')
  @IsBoolean()
  disponible?: boolean;

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
