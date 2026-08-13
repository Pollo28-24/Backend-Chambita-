import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TrabajadoresModule } from './trabajadores/trabajadores.module';
import { CategoriasModule } from './categorias/categorias.module';
import { OficiosModule } from './oficios/oficios.module';
import { PublicacionesModule } from './publicaciones/publicaciones.module';
import { ResenasModule } from './resenas/resenas.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    TrabajadoresModule,
    CategoriasModule,
    OficiosModule,
    PublicacionesModule,
    ResenasModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

