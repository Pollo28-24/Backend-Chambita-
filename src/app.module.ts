import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
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
import { getJwtSecret } from './common/config/jwt-secret';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: getJwtSecret(),
      signOptions: { expiresIn: '1d' },
    }),
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
