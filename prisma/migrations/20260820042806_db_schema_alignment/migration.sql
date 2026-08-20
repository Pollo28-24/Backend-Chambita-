/*
  Warnings:

  - You are about to drop the column `createdAt` on the `categorias` table. All the data in the column will be lost.
  - You are about to drop the column `categoriaId` on the `oficios` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `oficios` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `perfiles_trabajador` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `perfiles_trabajador` table. All the data in the column will be lost.
  - You are about to drop the column `usuarioId` on the `perfiles_trabajador` table. All the data in the column will be lost.
  - You are about to drop the column `zonaCobertura` on the `perfiles_trabajador` table. All the data in the column will be lost.
  - You are about to drop the column `clienteId` on the `publicaciones` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `publicaciones` table. All the data in the column will be lost.
  - You are about to drop the column `oficioId` on the `publicaciones` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `publicaciones` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `refresh_tokens` table. All the data in the column will be lost.
  - You are about to drop the column `expiresAt` on the `refresh_tokens` table. All the data in the column will be lost.
  - You are about to drop the column `revokedAt` on the `refresh_tokens` table. All the data in the column will be lost.
  - You are about to drop the column `tokenHash` on the `refresh_tokens` table. All the data in the column will be lost.
  - You are about to drop the column `usuarioId` on the `refresh_tokens` table. All the data in the column will be lost.
  - You are about to drop the column `clienteId` on the `resenas` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `resenas` table. All the data in the column will be lost.
  - You are about to drop the column `publicacionId` on the `resenas` table. All the data in the column will be lost.
  - You are about to drop the column `trabajadorId` on the `resenas` table. All the data in the column will be lost.
  - The primary key for the `trabajador_oficios` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `trabajador_oficios` table. All the data in the column will be lost.
  - You are about to drop the column `oficioId` on the `trabajador_oficios` table. All the data in the column will be lost.
  - You are about to drop the column `trabajadorId` on the `trabajador_oficios` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `usuarios` table. All the data in the column will be lost.
  - You are about to drop the column `fotoUrl` on the `usuarios` table. All the data in the column will be lost.
  - You are about to drop the column `passwordHash` on the `usuarios` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `usuarios` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[usuario_id]` on the table `perfiles_trabajador` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[publicacion_id]` on the table `resenas` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `categoria_id` to the `oficios` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `perfiles_trabajador` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usuario_id` to the `perfiles_trabajador` table without a default value. This is not possible if the table is not empty.
  - Added the required column `zona_cobertura` to the `perfiles_trabajador` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cliente_id` to the `publicaciones` table without a default value. This is not possible if the table is not empty.
  - Added the required column `oficio_id` to the `publicaciones` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `publicaciones` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expires_at` to the `refresh_tokens` table without a default value. This is not possible if the table is not empty.
  - Added the required column `token_hash` to the `refresh_tokens` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usuario_id` to the `refresh_tokens` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cliente_id` to the `resenas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `publicacion_id` to the `resenas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `trabajador_id` to the `resenas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `oficio_id` to the `trabajador_oficios` table without a default value. This is not possible if the table is not empty.
  - Added the required column `trabajador_id` to the `trabajador_oficios` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password_hash` to the `usuarios` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `usuarios` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `oficios` DROP FOREIGN KEY `oficios_categoriaId_fkey`;

-- DropForeignKey
ALTER TABLE `perfiles_trabajador` DROP FOREIGN KEY `perfiles_trabajador_usuarioId_fkey`;

-- DropForeignKey
ALTER TABLE `publicaciones` DROP FOREIGN KEY `publicaciones_clienteId_fkey`;

-- DropForeignKey
ALTER TABLE `publicaciones` DROP FOREIGN KEY `publicaciones_oficioId_fkey`;

-- DropForeignKey
ALTER TABLE `refresh_tokens` DROP FOREIGN KEY `refresh_tokens_usuarioId_fkey`;

-- DropForeignKey
ALTER TABLE `resenas` DROP FOREIGN KEY `resenas_clienteId_fkey`;

-- DropForeignKey
ALTER TABLE `resenas` DROP FOREIGN KEY `resenas_publicacionId_fkey`;

-- DropForeignKey
ALTER TABLE `resenas` DROP FOREIGN KEY `resenas_trabajadorId_fkey`;

-- DropForeignKey
ALTER TABLE `trabajador_oficios` DROP FOREIGN KEY `trabajador_oficios_oficioId_fkey`;

-- DropForeignKey
ALTER TABLE `trabajador_oficios` DROP FOREIGN KEY `trabajador_oficios_trabajadorId_fkey`;

-- DropIndex
DROP INDEX `oficios_categoriaId_idx` ON `oficios`;

-- DropIndex
DROP INDEX `perfiles_trabajador_usuarioId_key` ON `perfiles_trabajador`;

-- DropIndex
DROP INDEX `perfiles_trabajador_zonaCobertura_idx` ON `perfiles_trabajador`;

-- DropIndex
DROP INDEX `publicaciones_clienteId_idx` ON `publicaciones`;

-- DropIndex
DROP INDEX `publicaciones_createdAt_idx` ON `publicaciones`;

-- DropIndex
DROP INDEX `publicaciones_oficioId_idx` ON `publicaciones`;

-- DropIndex
DROP INDEX `refresh_tokens_expiresAt_idx` ON `refresh_tokens`;

-- DropIndex
DROP INDEX `refresh_tokens_usuarioId_idx` ON `refresh_tokens`;

-- DropIndex
DROP INDEX `resenas_clienteId_idx` ON `resenas`;

-- DropIndex
DROP INDEX `resenas_publicacionId_key` ON `resenas`;

-- DropIndex
DROP INDEX `resenas_trabajadorId_idx` ON `resenas`;

-- DropIndex
DROP INDEX `trabajador_oficios_oficioId_idx` ON `trabajador_oficios`;

-- AlterTable
ALTER TABLE `categorias` DROP COLUMN `createdAt`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `oficios` DROP COLUMN `categoriaId`,
    DROP COLUMN `createdAt`,
    ADD COLUMN `categoria_id` CHAR(36) NOT NULL,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `perfiles_trabajador` DROP COLUMN `createdAt`,
    DROP COLUMN `updatedAt`,
    DROP COLUMN `usuarioId`,
    DROP COLUMN `zonaCobertura`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL,
    ADD COLUMN `usuario_id` CHAR(36) NOT NULL,
    ADD COLUMN `zona_cobertura` VARCHAR(150) NOT NULL;

-- AlterTable
ALTER TABLE `publicaciones` DROP COLUMN `clienteId`,
    DROP COLUMN `createdAt`,
    DROP COLUMN `oficioId`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `cliente_id` CHAR(36) NOT NULL,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `oficio_id` CHAR(36) NOT NULL,
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `refresh_tokens` DROP COLUMN `createdAt`,
    DROP COLUMN `expiresAt`,
    DROP COLUMN `revokedAt`,
    DROP COLUMN `tokenHash`,
    DROP COLUMN `usuarioId`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `expires_at` DATETIME(3) NOT NULL,
    ADD COLUMN `revoked_at` DATETIME(3) NULL,
    ADD COLUMN `token_hash` VARCHAR(255) NOT NULL,
    ADD COLUMN `usuario_id` CHAR(36) NOT NULL;

-- AlterTable
ALTER TABLE `resenas` DROP COLUMN `clienteId`,
    DROP COLUMN `createdAt`,
    DROP COLUMN `publicacionId`,
    DROP COLUMN `trabajadorId`,
    ADD COLUMN `cliente_id` CHAR(36) NOT NULL,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `publicacion_id` CHAR(36) NOT NULL,
    ADD COLUMN `trabajador_id` CHAR(36) NOT NULL,
    MODIFY `calificacion` SMALLINT NOT NULL;

-- AlterTable
ALTER TABLE `trabajador_oficios` DROP PRIMARY KEY,
    DROP COLUMN `createdAt`,
    DROP COLUMN `oficioId`,
    DROP COLUMN `trabajadorId`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `oficio_id` CHAR(36) NOT NULL,
    ADD COLUMN `trabajador_id` CHAR(36) NOT NULL,
    ADD PRIMARY KEY (`trabajador_id`, `oficio_id`);

-- AlterTable
ALTER TABLE `usuarios` DROP COLUMN `createdAt`,
    DROP COLUMN `fotoUrl`,
    DROP COLUMN `passwordHash`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `foto_url` TEXT NULL,
    ADD COLUMN `password_hash` VARCHAR(255) NOT NULL,
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- CreateIndex
CREATE INDEX `oficios_categoria_id_idx` ON `oficios`(`categoria_id`);

-- CreateIndex
CREATE UNIQUE INDEX `perfiles_trabajador_usuario_id_key` ON `perfiles_trabajador`(`usuario_id`);

-- CreateIndex
CREATE INDEX `perfiles_trabajador_zona_cobertura_idx` ON `perfiles_trabajador`(`zona_cobertura`);

-- CreateIndex
CREATE INDEX `publicaciones_cliente_id_idx` ON `publicaciones`(`cliente_id`);

-- CreateIndex
CREATE INDEX `publicaciones_oficio_id_idx` ON `publicaciones`(`oficio_id`);

-- CreateIndex
CREATE INDEX `publicaciones_created_at_idx` ON `publicaciones`(`created_at`);

-- CreateIndex
CREATE INDEX `refresh_tokens_usuario_id_idx` ON `refresh_tokens`(`usuario_id`);

-- CreateIndex
CREATE INDEX `refresh_tokens_expires_at_idx` ON `refresh_tokens`(`expires_at`);

-- CreateIndex
CREATE UNIQUE INDEX `resenas_publicacion_id_key` ON `resenas`(`publicacion_id`);

-- CreateIndex
CREATE INDEX `resenas_trabajador_id_idx` ON `resenas`(`trabajador_id`);

-- CreateIndex
CREATE INDEX `resenas_cliente_id_idx` ON `resenas`(`cliente_id`);

-- CreateIndex
CREATE INDEX `resenas_publicacion_id_idx` ON `resenas`(`publicacion_id`);

-- CreateIndex
CREATE INDEX `resenas_cliente_id_publicacion_id_idx` ON `resenas`(`cliente_id`, `publicacion_id`);

-- CreateIndex
CREATE INDEX `trabajador_oficios_oficio_id_idx` ON `trabajador_oficios`(`oficio_id`);

-- CreateIndex
CREATE INDEX `trabajador_oficios_trabajador_id_idx` ON `trabajador_oficios`(`trabajador_id`);

-- AddForeignKey
ALTER TABLE `perfiles_trabajador` ADD CONSTRAINT `perfiles_trabajador_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `oficios` ADD CONSTRAINT `oficios_categoria_id_fkey` FOREIGN KEY (`categoria_id`) REFERENCES `categorias`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `trabajador_oficios` ADD CONSTRAINT `trabajador_oficios_trabajador_id_fkey` FOREIGN KEY (`trabajador_id`) REFERENCES `perfiles_trabajador`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `trabajador_oficios` ADD CONSTRAINT `trabajador_oficios_oficio_id_fkey` FOREIGN KEY (`oficio_id`) REFERENCES `oficios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `publicaciones` ADD CONSTRAINT `publicaciones_cliente_id_fkey` FOREIGN KEY (`cliente_id`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `publicaciones` ADD CONSTRAINT `publicaciones_oficio_id_fkey` FOREIGN KEY (`oficio_id`) REFERENCES `oficios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `resenas` ADD CONSTRAINT `resenas_cliente_id_fkey` FOREIGN KEY (`cliente_id`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `resenas` ADD CONSTRAINT `resenas_trabajador_id_fkey` FOREIGN KEY (`trabajador_id`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `resenas` ADD CONSTRAINT `resenas_publicacion_id_fkey` FOREIGN KEY (`publicacion_id`) REFERENCES `publicaciones`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `refresh_tokens` ADD CONSTRAINT `refresh_tokens_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
