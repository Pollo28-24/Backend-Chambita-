import { PartialType } from '@nestjs/swagger';
import { CreateOficioDto } from './create-oficio.dto';

export class UpdateOficioDto extends PartialType(CreateOficioDto) {}

