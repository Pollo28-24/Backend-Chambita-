import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { OficiosService } from './oficios.service';
import { CreateOficioDto } from './dto/create-oficio.dto';
import { UpdateOficioDto } from './dto/update-oficio.dto';

@Controller('oficios')
export class OficiosController {
  constructor(private readonly oficiosService: OficiosService) {}

  @Post()
  create(@Body() dto: CreateOficioDto) {
    return this.oficiosService.create(dto);
  }

  @Get()
  findAll(@Query('categoriaId') categoriaId?: string) {
    return this.oficiosService.findAll(categoriaId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.oficiosService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateOficioDto) {
    return this.oficiosService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.oficiosService.remove(id);
  }
}
