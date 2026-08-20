import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  nombre: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  apellido: string;

  @IsEmail()
  @IsNotEmpty()
  @Length(5, 150)
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(7, 20)
  telefono: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 50)
  password: string;

  @IsEnum(['CLIENTE', 'TRABAJADOR'], {
    message: 'El rol debe ser CLIENTE o TRABAJADOR',
  })
  @IsNotEmpty()
  rol: 'CLIENTE' | 'TRABAJADOR';

  @IsString()
  @IsOptional()
  fotoUrl?: string;

  // Campos opcionales para perfil si es TRABAJADOR
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
}
