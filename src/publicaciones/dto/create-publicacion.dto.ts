import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';

export class CreatePublicacionDto {
  @IsString()
  @IsNotEmpty()
  oficioId: string;

  @IsString()
  @IsNotEmpty()
  @Length(5, 150)
  titulo: string;

  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 200)
  ubicacion: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  presupuesto?: number;
}

