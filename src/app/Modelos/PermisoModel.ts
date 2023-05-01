export class PermisoModel {
  id_permiso: number | null;
  nombre: string | null;
  checked: boolean | null;
  titulo: string | null;
  constructor(id_permiso: number | null, nombre: string | null, checked : boolean | null, titulo: string | null) {
    this.id_permiso = id_permiso;
    this.nombre = nombre;
    this.checked = checked;
    this.titulo = titulo;
  }
}
