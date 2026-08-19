import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PublicacionesService } from './publicaciones.service';
import { CreatePublicacionDto } from './dto/create-publicacion.dto';
import { UpdatePublicacionDto } from './dto/update-publicacion.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { GetUser } from '../common/decorators/get-user.decorator';

@Controller('publicaciones')
export class PublicacionesController {
  constructor(private readonly publicacionesService: PublicacionesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLIENTE')
  create(@GetUser('sub') clienteId: string, @Body() dto: CreatePublicacionDto) {
    return this.publicacionesService.create(clienteId, dto);
  }

  @Get()
  findAll(
    @Query('oficioId') oficioId?: string,
    @Query('categoriaId') categoriaId?: string,
    @Query('ubicacion') ubicacion?: string,
    @Query('estado') estado?: string,
  ) {
    return this.publicacionesService.findAll({
      oficioId,
      categoriaId,
      ubicacion,
      estado,
    });
  }

  @Get('mis-publicaciones')
  @UseGuards(JwtAuthGuard)
  findMyPublications(@GetUser('sub') clienteId: string) {
    return this.publicacionesService.findMyPublications(clienteId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.publicacionesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @GetUser('sub') clienteId: string,
    @Body() dto: UpdatePublicacionDto,
  ) {
    return this.publicacionesService.update(id, clienteId, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @GetUser('sub') clienteId: string) {
    return this.publicacionesService.remove(id, clienteId);
  }
}
