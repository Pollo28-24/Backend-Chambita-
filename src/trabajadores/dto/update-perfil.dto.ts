import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';

export class UpdatePerfilDto {
  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsString()
  @IsOptional()
  experiencia?: string;

  @IsString()
  @IsOptional()
  @Length(2, 150)
  zonaCobertura?: string;

  @IsBoolean()
  @IsOptional()
  disponible?: boolean;
}
