import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  // Cuando las dependencias estén instaladas en la máquina de tu compañero,
  // PrismaClient estará disponible para extenderlo o instanciarlo.
  private prisma: any;

  async onModuleInit() {
    try {
      const { PrismaClient } = await import('@prisma/client');
      this.prisma = new PrismaClient();
      await this.prisma.$connect();
    } catch {
      // Entorno sin @prisma/client listo (a la espera de npm install del compañero)
    }
  }

  async onModuleDestroy() {
    if (this.prisma?.$disconnect) {
      await this.prisma.$disconnect();
    }
  }

  get client() {
    return this.prisma;
  }
}
