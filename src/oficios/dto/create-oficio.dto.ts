export class CreateOficioDto {
  categoriaId: string;
  nombre: string;
  descripcion?: string;
}

export class UpdateOficioDto {
  categoriaId?: string;
  nombre?: string;
  descripcion?: string;
  activo?: boolean;
}
