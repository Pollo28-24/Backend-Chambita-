import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ResenasService } from './resenas.service';
import { CreateResenaDto } from './dto/create-resena.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { GetUser } from '../common/decorators/get-user.decorator';

@Controller()
export class ResenasController {
  constructor(private readonly resenasService: ResenasService) {}

  @Post('resenas')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLIENTE')
  create(@GetUser('sub') clienteId: string, @Body() dto: CreateResenaDto) {
    return this.resenasService.create(clienteId, dto);
  }

  @Get('trabajadores/:id/resenas')
  findByTrabajador(@Param('id') trabajadorId: string) {
    return this.resenasService.findByTrabajador(trabajadorId);
  }

  @Get('trabajadores/:id/resumen')
  getResumenTrabajador(@Param('id') trabajadorId: string) {
    return this.resenasService.getResumenTrabajador(trabajadorId);
  }
}
