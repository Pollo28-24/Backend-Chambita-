export class RegisterDto {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  password: string;
  rol: 'CLIENTE' | 'TRABAJADOR';
  fotoUrl?: string;
  // Campos opcionales para perfil si es TRABAJADOR
  descripcion?: string;
  experiencia?: string;
  zonaCobertura?: string;
}
