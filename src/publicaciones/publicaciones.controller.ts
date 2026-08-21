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
import { PublicacionQueryDto } from './dto/publicacion-query.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { GetUser } from '../common/decorators/get-user.decorator';
import { ApiQuery } from '@nestjs/swagger';
import { PublicacionEstado } from '@prisma/client';

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
  @ApiQuery({
    name: 'busqueda',
    required: false,
    type: String,
    description: 'Palabra clave para buscar en titulo y descripcion.',
    example: 'plomeria urgente',
  })
  @ApiQuery({
    name: 'categoriaId',
    required: false,
    type: String,
    description: 'ID de la categoria asociada al oficio.',
    example: '8d8a4e98-50ba-4d99-a120-6b5d61ab8a94',
  })
  @ApiQuery({
    name: 'oficioId',
    required: false,
    type: String,
    description: 'ID del oficio solicitado en la publicacion.',
    example: '7a62b8ab-43c2-4f1e-bfaa-e5f03d3a5019',
  })
  @ApiQuery({
    name: 'estado',
    required: false,
    enum: PublicacionEstado,
    description: 'Estado de la publicacion.',
    example: PublicacionEstado.ABIERTA,
  })
  @ApiQuery({
    name: 'presupuestoMin',
    required: false,
    type: Number,
    description: 'Presupuesto minimo para filtrar publicaciones.',
    example: 150,
  })
  @ApiQuery({
    name: 'presupuestoMax',
    required: false,
    type: Number,
    description: 'Presupuesto maximo para filtrar publicaciones.',
    example: 1200,
  })
  @ApiQuery({
    name: 'ubicacion',
    required: false,
    type: String,
    description: 'Texto de ubicacion para filtrar publicaciones.',
    example: 'Guadalajara',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Numero de pagina (empieza en 1).',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Cantidad de resultados por pagina.',
    example: 10,
  })
  findAll(@Query() query: PublicacionQueryDto) {
    return this.publicacionesService.findAll(query);
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
