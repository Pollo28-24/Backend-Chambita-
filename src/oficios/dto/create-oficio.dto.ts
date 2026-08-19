import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateOficioDto {
  @IsString()
  @IsNotEmpty()
  categoriaId: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  nombre: string;

  @IsString()
  @IsOptional()
  descripcion?: string;
}

export class UpdateOficioDto {
  @IsString()
  @IsOptional()
  categoriaId?: string;

  @IsString()
  @IsOptional()
  @Length(2, 100)
  nombre?: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsBoolean()
  @IsOptional()
  activo?: boolean;
}
