import { IsOptional, IsString, Length } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @Length(2, 100)
  nombre?: string;

  @IsString()
  @IsOptional()
  @Length(2, 100)
  apellido?: string;

  @IsString()
  @IsOptional()
  @Length(7, 20)
  telefono?: string;

  @IsString()
  @IsOptional()
  fotoUrl?: string;
}
