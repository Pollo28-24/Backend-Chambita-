import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateResenaDto {
  @IsString()
  @IsNotEmpty()
  trabajadorId: string;

  @IsString()
  @IsNotEmpty()
  publicacionId: string;

  @IsInt()
  @Min(1)
  @Max(5)
  @IsNotEmpty()
  calificacion: number; // 1 a 5

  @IsString()
  @IsOptional()
  comentario?: string;
}
