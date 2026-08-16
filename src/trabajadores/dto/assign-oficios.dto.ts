export class OficioItemDto {
  oficioId: string;
  principal: boolean;
}

export class AssignOficiosDto {
  oficios: OficioItemDto[];
}
