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
import {
  ApiOperation,
  ApiOkResponse,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';

@Controller('trabajadores')
export class TrabajadoresController {
  constructor(private readonly trabajadoresService: TrabajadoresService) {}

  @Get()
  @ApiOperation({
    summary: 'Listar trabajadores con filtros y paginación',
  })
  @ApiOkResponse({
    description: 'Listado paginado de trabajadores.',
    schema: {
      example: {
        success: true,
        statusCode: 200,
        data: [{ id: 'trabajador-1', usuario: { nombre: 'Ana' } }],
        meta: {
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
        timestamp: '2026-08-24T22:00:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Parámetros de consulta inválidos.',
  })
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
    name: 'zonaCobertura',
    required: false,
    type: String,
    description: 'Zona de cobertura del trabajador.',
    example: 'Zapopan',
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
