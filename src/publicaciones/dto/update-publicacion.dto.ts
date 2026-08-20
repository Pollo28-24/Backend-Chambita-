import { PartialType } from '@nestjs/swagger';
import { CreatePublicacionDto } from './create-publicacion.dto';
import { IsEnum, IsOptional } from 'class-validator';

export class UpdatePublicacionDto extends PartialType(CreatePublicacionDto) {
  @IsEnum(['ABIERTA', 'EN_PROGRESO', 'COMPLETADA'], {
    message: 'El estado debe ser ABIERTA, EN_PROGRESO o COMPLETADA',
  })
  @IsOptional()
  estado?: 'ABIERTA' | 'EN_PROGRESO' | 'COMPLETADA';
}

