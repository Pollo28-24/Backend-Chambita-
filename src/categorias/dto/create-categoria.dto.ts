export class CreateCategoriaDto {
  nombre: string;
  descripcion?: string;
}

export class UpdateCategoriaDto {
  nombre?: string;
  descripcion?: string;
  activo?: boolean;
}
