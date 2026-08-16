export class CreateResenaDto {
  trabajadorId: string;
  publicacionId: string;
  calificacion: number; // 1 a 5
  comentario?: string;
}
