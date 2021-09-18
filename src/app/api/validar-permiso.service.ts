import { PermisoModel } from '../Modelos/PermisoModel';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class ValidarPermisoService {

  constructor() {}

  public isChecked(permisos: any, permiso: any) {
    if (permisos !== null) {
      for (let item of permisos) {
        if (item.nombre === permiso) {
          return item.checked;
        }
      }
    }
    return false;
  }
}
