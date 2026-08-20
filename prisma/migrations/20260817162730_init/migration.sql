/*
  Warnings:

  - You are about to drop the `categoria` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `oficio` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `perfiltrabajador` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `publicacion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `refreshtoken` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `resena` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `trabajadoroficio` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `usuario` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `oficio` DROP FOREIGN KEY `Oficio_categoriaId_fkey`;

-- DropForeignKey
ALTER TABLE `perfiltrabajador` DROP FOREIGN KEY `PerfilTrabajador_usuarioId_fkey`;

-- DropForeignKey
ALTER TABLE `publicacion` DROP FOREIGN KEY `Publicacion_clienteId_fkey`;

-- DropForeignKey
ALTER TABLE `publicacion` DROP FOREIGN KEY `Publicacion_oficioId_fkey`;

-- DropForeignKey
ALTER TABLE `refreshtoken` DROP FOREIGN KEY `RefreshToken_usuarioId_fkey`;

-- DropForeignKey
ALTER TABLE `resena` DROP FOREIGN KEY `Resena_clienteId_fkey`;

-- DropForeignKey
ALTER TABLE `resena` DROP FOREIGN KEY `Resena_publicacionId_fkey`;

-- DropForeignKey
ALTER TABLE `resena` DROP FOREIGN KEY `Resena_trabajadorId_fkey`;

-- DropForeignKey
ALTER TABLE `trabajadoroficio` DROP FOREIGN KEY `TrabajadorOficio_oficioId_fkey`;

-- DropForeignKey
ALTER TABLE `trabajadoroficio` DROP FOREIGN KEY `TrabajadorOficio_trabajadorId_fkey`;

-- DropTable
DROP TABLE `categoria`;

-- DropTable
DROP TABLE `oficio`;

-- DropTable
DROP TABLE `perfiltrabajador`;

-- DropTable
DROP TABLE `publicacion`;

-- DropTable
DROP TABLE `refreshtoken`;

-- DropTable
DROP TABLE `resena`;

-- DropTable
DROP TABLE `trabajadoroficio`;

-- DropTable
DROP TABLE `usuario`;

-- CreateTable
CREATE TABLE `usuarios` (
    `id` CHAR(36) NOT NULL,
    `nombre` VARCHAR(100) NOT NULL,
    `apellido` VARCHAR(100) NOT NULL,
    `email` VARCHAR(150) NOT NULL,
    `telefono` VARCHAR(20) NOT NULL,
    `passwordHash` VARCHAR(255) NOT NULL,
    `rol` ENUM('CLIENTE', 'TRABAJADOR') NOT NULL,
    `fotoUrl` TEXT NULL,
    `activo` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `usuarios_email_key`(`email`),
    UNIQUE INDEX `usuarios_telefono_key`(`telefono`),
    INDEX `usuarios_rol_idx`(`rol`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `perfiles_trabajador` (
    `id` CHAR(36) NOT NULL,
    `usuarioId` CHAR(36) NOT NULL,
    `descripcion` TEXT NULL,
    `experiencia` TEXT NULL,
    `zonaCobertura` VARCHAR(150) NOT NULL,
    `disponible` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `perfiles_trabajador_usuarioId_key`(`usuarioId`),
    INDEX `perfiles_trabajador_zonaCobertura_idx`(`zonaCobertura`),
    INDEX `perfiles_trabajador_disponible_idx`(`disponible`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `categorias` (
    `id` CHAR(36) NOT NULL,
    `nombre` VARCHAR(100) NOT NULL,
    `descripcion` TEXT NULL,
    `activo` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `categorias_nombre_key`(`nombre`),
    INDEX `categorias_activo_idx`(`activo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `oficios` (
    `id` CHAR(36) NOT NULL,
    `categoriaId` CHAR(36) NOT NULL,
    `nombre` VARCHAR(100) NOT NULL,
    `descripcion` TEXT NULL,
    `activo` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `oficios_nombre_key`(`nombre`),
    INDEX `oficios_categoriaId_idx`(`categoriaId`),
    INDEX `oficios_activo_idx`(`activo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `trabajador_oficios` (
    `trabajadorId` CHAR(36) NOT NULL,
    `oficioId` CHAR(36) NOT NULL,
    `principal` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `trabajador_oficios_oficioId_idx`(`oficioId`),
    PRIMARY KEY (`trabajadorId`, `oficioId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `publicaciones` (
    `id` CHAR(36) NOT NULL,
    `clienteId` CHAR(36) NOT NULL,
    `oficioId` CHAR(36) NOT NULL,
    `titulo` VARCHAR(150) NOT NULL,
    `descripcion` TEXT NOT NULL,
    `ubicacion` VARCHAR(200) NOT NULL,
    `presupuesto` DECIMAL(10, 2) NULL,
    `estado` ENUM('ABIERTA', 'EN_PROGRESO', 'COMPLETADA') NOT NULL DEFAULT 'ABIERTA',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `publicaciones_clienteId_idx`(`clienteId`),
    INDEX `publicaciones_oficioId_idx`(`oficioId`),
    INDEX `publicaciones_estado_idx`(`estado`),
    INDEX `publicaciones_ubicacion_idx`(`ubicacion`),
    INDEX `publicaciones_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `resenas` (
    `id` CHAR(36) NOT NULL,
    `clienteId` CHAR(36) NOT NULL,
    `trabajadorId` CHAR(36) NOT NULL,
    `publicacionId` CHAR(36) NOT NULL,
    `calificacion` TINYINT NOT NULL,
    `comentario` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `resenas_publicacionId_key`(`publicacionId`),
    INDEX `resenas_trabajadorId_idx`(`trabajadorId`),
    INDEX `resenas_clienteId_idx`(`clienteId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `refresh_tokens` (
    `id` CHAR(36) NOT NULL,
    `usuarioId` CHAR(36) NOT NULL,
    `tokenHash` VARCHAR(255) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `revokedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `refresh_tokens_usuarioId_idx`(`usuarioId`),
    INDEX `refresh_tokens_expiresAt_idx`(`expiresAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `perfiles_trabajador` ADD CONSTRAINT `perfiles_trabajador_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `oficios` ADD CONSTRAINT `oficios_categoriaId_fkey` FOREIGN KEY (`categoriaId`) REFERENCES `categorias`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `trabajador_oficios` ADD CONSTRAINT `trabajador_oficios_trabajadorId_fkey` FOREIGN KEY (`trabajadorId`) REFERENCES `perfiles_trabajador`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `trabajador_oficios` ADD CONSTRAINT `trabajador_oficios_oficioId_fkey` FOREIGN KEY (`oficioId`) REFERENCES `oficios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `publicaciones` ADD CONSTRAINT `publicaciones_clienteId_fkey` FOREIGN KEY (`clienteId`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `publicaciones` ADD CONSTRAINT `publicaciones_oficioId_fkey` FOREIGN KEY (`oficioId`) REFERENCES `oficios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `resenas` ADD CONSTRAINT `resenas_clienteId_fkey` FOREIGN KEY (`clienteId`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `resenas` ADD CONSTRAINT `resenas_trabajadorId_fkey` FOREIGN KEY (`trabajadorId`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `resenas` ADD CONSTRAINT `resenas_publicacionId_fkey` FOREIGN KEY (`publicacionId`) REFERENCES `publicaciones`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `refresh_tokens` ADD CONSTRAINT `refresh_tokens_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
