export class CreatePublicacionDto {
  oficioId: string;
  titulo: string;
  descripcion: string;
  ubicacion: string;
  presupuesto?: number;
}

export class UpdatePublicacionDto {
  titulo?: string;
  descripcion?: string;
  ubicacion?: string;
  presupuesto?: number;
  estado?: 'ABIERTA' | 'EN_PROGRESO' | 'COMPLETADA';
}
