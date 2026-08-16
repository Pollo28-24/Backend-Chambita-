import { Module } from '@nestjs/common';
import { OficiosController } from './oficios.controller';
import { OficiosService } from './oficios.service';

@Module({
  controllers: [OficiosController],
  providers: [OficiosService],
  exports: [OficiosService],
})
export class OficiosModule {}
