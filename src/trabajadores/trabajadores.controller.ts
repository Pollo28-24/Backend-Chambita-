import { Body, Controller, Get, Param, Patch, Put, Query, UseGuards } from '@nestjs/common';
import { TrabajadoresService } from './trabajadores.service';
import { UpdatePerfilDto } from './dto/update-perfil.dto';
import { AssignOficiosDto } from './dto/assign-oficios.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { GetUser } from '../common/decorators/get-user.decorator';

@Controller('trabajadores')
export class TrabajadoresController {
  constructor(private readonly trabajadoresService: TrabajadoresService) {}

  @Get()
  findAll(
    @Query('oficioId') oficioId?: string,
    @Query('categoriaId') categoriaId?: string,
    @Query('zona') zona?: string,
    @Query('disponible') disponible?: boolean,
  ) {
    return this.trabajadoresService.findAll({ oficioId, categoriaId, zona, disponible });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.trabajadoresService.findOne(id);
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('TRABAJADOR')
  updatePerfil(@GetUser('sub') usuarioId: string, @Body() dto: UpdatePerfilDto) {
    return this.trabajadoresService.updatePerfil(usuarioId, dto);
  }

  @Put('me/oficios')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('TRABAJADOR')
  assignOficios(@GetUser('sub') usuarioId: string, @Body() dto: AssignOficiosDto) {
    return this.trabajadoresService.assignOficios(usuarioId, dto);
  }
}
