import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TrabajadoresService } from './trabajadores.service';
import { UpdatePerfilDto } from './dto/update-perfil.dto';
import { AssignOficiosDto } from './dto/assign-oficios.dto';
import { TrabajadorQueryDto } from './dto/trabajador-query.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { GetUser } from '../common/decorators/get-user.decorator';
import { ApiQuery } from '@nestjs/swagger';

@Controller('trabajadores')
export class TrabajadoresController {
  constructor(private readonly trabajadoresService: TrabajadoresService) {}

  @Get()
  @ApiQuery({
    name: 'busqueda',
    required: false,
    type: String,
    description:
      'Palabra clave para buscar en nombre, apellido o descripcion del perfil.',
    example: 'electricista',
  })
  @ApiQuery({
    name: 'oficioId',
    required: false,
    type: String,
    description: 'ID del oficio del trabajador.',
    example: '7a62b8ab-43c2-4f1e-bfaa-e5f03d3a5019',
  })
  @ApiQuery({
    name: 'categoriaId',
    required: false,
    type: String,
    description: 'ID de la categoría del oficio del trabajador.',
    example: '8d8a4e98-50ba-4d99-a120-6b5d61ab8a94',
  })
  @ApiQuery({
    name: 'zonaCobertura',
    required: false,
    type: String,
    description: 'Zona de cobertura del trabajador.',
    example: 'Zapopan',
  })
  @ApiQuery({
    name: 'disponible',
    required: false,
    type: Boolean,
    description: 'Filtrar trabajadores disponibles.',
    example: true,
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
  findAll(@Query() query: TrabajadorQueryDto) {
    return this.trabajadoresService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.trabajadoresService.findOne(id);
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('TRABAJADOR')
  updatePerfil(
    @GetUser('sub') usuarioId: string,
    @Body() dto: UpdatePerfilDto,
  ) {
    return this.trabajadoresService.updatePerfil(usuarioId, dto);
  }

  @Put('me/oficios')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('TRABAJADOR')
  assignOficios(
    @GetUser('sub') usuarioId: string,
    @Body() dto: AssignOficiosDto,
  ) {
    return this.trabajadoresService.assignOficios(usuarioId, dto);
  }
}
