import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class OficioItemDto {
  @IsString()
  @IsNotEmpty()
  oficioId: string;

  @IsBoolean()
  @IsNotEmpty()
  principal: boolean;
}

export class AssignOficiosDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OficioItemDto)
  oficios: OficioItemDto[];
}
