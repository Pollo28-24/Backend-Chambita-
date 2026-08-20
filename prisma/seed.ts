import { PrismaClient, Role, PublicacionEstado } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import * as bcrypt from 'bcrypt';
import 'dotenv/config';

const adapter = new PrismaMariaDb(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Iniciando seed de prueba...');

  // 1. Limpiar base de datos
  await prisma.refreshToken.deleteMany();
  await prisma.resena.deleteMany();
  await prisma.publicacion.deleteMany();
  await prisma.trabajadorOficio.deleteMany();
  await prisma.perfilTrabajador.deleteMany();
  await prisma.oficio.deleteMany();
  await prisma.categoria.deleteMany();
  await prisma.usuario.deleteMany();

  // 2. Categorías
  const catHogar = await prisma.categoria.create({
    data: {
      nombre: 'Hogar y Reparaciones',
      descripcion: 'Mantenimiento e instalaciones residenciales',
    },
  });

  const catTec = await prisma.categoria.create({
    data: {
      nombre: 'Tecnología',
      descripcion: 'Soporte y reparación de equipos',
    },
  });

  const catConstruccion = await prisma.categoria.create({
    data: {
      nombre: 'Construcción y Acabados',
      descripcion: 'Remodelaciones y acabados',
    },
  });

  // 3. Oficios
  const plomeria = await prisma.oficio.create({
    data: { nombre: 'Plomería', descripcion: 'Fugas y tuberías', categoriaId: catHogar.id },
  });

  const electricidad = await prisma.oficio.create({
    data: { nombre: 'Electricidad', descripcion: 'Fallas e instalaciones', categoriaId: catHogar.id },
  });

  const reparacionPc = await prisma.oficio.create({
    data: { nombre: 'Reparación de PC', descripcion: 'Laptops y computadoras', categoriaId: catTec.id },
  });

  const pintura = await prisma.oficio.create({
    data: { nombre: 'Pintura', descripcion: 'Interiores y exteriores', categoriaId: catConstruccion.id },
  });

  // 4. Contraseña base
  const passwordHash = await bcrypt.hash('password123', 10);

  // 5. Clientes
  const cliente1 = await prisma.usuario.create({
    data: {
      nombre: 'Carlos',
      apellido: 'Mendoza',
      email: 'cliente@test.com',
      telefono: '9511112233',
      passwordHash,
      rol: Role.CLIENTE,
    },
  });

  const cliente2 = await prisma.usuario.create({
    data: {
      nombre: 'María',
      apellido: 'López',
      email: 'maria@test.com',
      telefono: '9512223344',
      passwordHash,
      rol: Role.CLIENTE,
    },
  });

  const cliente3 = await prisma.usuario.create({
    data: {
      nombre: 'Sofía',
      apellido: 'Hernández',
      email: 'sofia@test.com',
      telefono: '9513334455',
      passwordHash,
      rol: Role.CLIENTE,
    },
  });

  // 6. Trabajadores y Perfiles
  const trabajador1 = await prisma.usuario.create({
    data: {
      nombre: 'Juan',
      apellido: 'Pérez',
      email: 'trabajador@test.com',
      telefono: '9514445566',
      passwordHash,
      rol: Role.TRABAJADOR,
      perfilTrabajador: {
        create: {
          descripcion: 'Especialista en instalaciones residenciales y plomería.',
          experiencia: '5 años',
          zonaCobertura: 'Oaxaca Centro',
        },
      },
    },
    include: { perfilTrabajador: true },
  });

  const trabajador2 = await prisma.usuario.create({
    data: {
      nombre: 'Roberto',
      apellido: 'Gómez',
      email: 'roberto@test.com',
      telefono: '9515556677',
      passwordHash,
      rol: Role.TRABAJADOR,
      perfilTrabajador: {
        create: {
          descripcion: 'Técnico en sistemas y mantenimiento de computadoras.',
          experiencia: '3 años',
          zonaCobertura: 'Colonia Reforma y Centro',
        },
      },
    },
    include: { perfilTrabajador: true },
  });

  const trabajador3 = await prisma.usuario.create({
    data: {
      nombre: 'Pedro',
      apellido: 'Sánchez',
      email: 'pedro@test.com',
      telefono: '9516667788',
      passwordHash,
      rol: Role.TRABAJADOR,
      perfilTrabajador: {
        create: {
          descripcion: 'Pintor profesional para interiores y fachadas.',
          experiencia: '7 años',
          zonaCobertura: 'Santa Cruz Xoxocotlán y Centro',
        },
      },
    },
    include: { perfilTrabajador: true },
  });

  // 7. Asignar oficios a trabajadores
  await prisma.trabajadorOficio.createMany({
    data: [
      { trabajadorId: trabajador1.perfilTrabajador!.id, oficioId: plomeria.id, principal: true },
      { trabajadorId: trabajador1.perfilTrabajador!.id, oficioId: electricidad.id, principal: false },
      { trabajadorId: trabajador2.perfilTrabajador!.id, oficioId: reparacionPc.id, principal: true },
      { trabajadorId: trabajador3.perfilTrabajador!.id, oficioId: pintura.id, principal: true },
    ],
  });

  // 8. Publicaciones
  const pub1 = await prisma.publicacion.create({
    data: {
      clienteId: cliente1.id,
      oficioId: electricidad.id,
      titulo: 'Instalación de lámparas LED',
      descripcion: 'Colocar 4 lámparas empotradas en techo de tablaroca.',
      ubicacion: 'Colonia Reforma, Oaxaca',
      presupuesto: 500.00,
      estado: PublicacionEstado.ABIERTA,
    },
  });

  const pub2 = await prisma.publicacion.create({
    data: {
      clienteId: cliente2.id,
      oficioId: reparacionPc.id,
      titulo: 'Mantenimiento preventivo a laptop',
      descripcion: 'Limpieza interna y cambio de pasta térmica a laptop HP.',
      ubicacion: 'Xoxocotlán, Oaxaca',
      presupuesto: 400.00,
      estado: PublicacionEstado.ABIERTA,
    },
  });

  const pub3 = await prisma.publicacion.create({
    data: {
      clienteId: cliente3.id,
      oficioId: pintura.id,
      titulo: 'Pintar fachada de casa',
      descripcion: 'Fachada de dos pisos, incluyo la pintura.',
      ubicacion: 'San Felipe del Agua, Oaxaca',
      presupuesto: 2500.00,
      estado: PublicacionEstado.EN_PROGRESO,
    },
  });

  const pub4 = await prisma.publicacion.create({
    data: {
      clienteId: cliente1.id,
      oficioId: plomeria.id,
      titulo: 'Reparación de fuga en lavabo',
      descripcion: 'Fuga constante en la tubería de desagüe.',
      ubicacion: 'Centro Histórico, Oaxaca',
      presupuesto: 350.00,
      estado: PublicacionEstado.COMPLETADA,
    },
  });

  const pub5 = await prisma.publicacion.create({
    data: {
      clienteId: cliente2.id,
      oficioId: plomeria.id,
      titulo: 'Cambio de llave de paso',
      descripcion: 'Instalar llave nueva en la toma principal.',
      ubicacion: 'Colonia Volcanes, Oaxaca',
      presupuesto: 300.00,
      estado: PublicacionEstado.COMPLETADA,
    },
  });

  // 9. Reseñas
  await prisma.resena.createMany({
    data: [
      {
        clienteId: cliente1.id,
        trabajadorId: trabajador1.id,
        publicacionId: pub4.id,
        calificacion: 5,
        comentario: 'Excelente trabajo. Reparó la fuga rápidamente.',
      },
      {
        clienteId: cliente2.id,
        trabajadorId: trabajador1.id,
        publicacionId: pub5.id,
        calificacion: 4,
        comentario: 'Buen servicio, llegó a tiempo y resolvió el problema.',
      },
    ],
  });

  console.log('Seed completado.');
}

main()
  .catch((e) => {
    console.error('Error en el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });