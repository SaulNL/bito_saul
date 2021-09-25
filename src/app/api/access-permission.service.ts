import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FiltroCatVariableModel } from './../Modelos/catalogos/FiltroCatVariableModel';
import { FiltroCatOrgModel } from './../Modelos/catalogos/FiltroCatOrgModel';
import { AppSettings } from '../AppSettings';
import { FiltroCatRolModel } from './../Modelos/catalogos/FiltroCatRolModel';
import { FiltroCatPermisosModel } from './../Modelos/catalogos/FiltroCatPermisosModel';
import { FiltroCatPalabrasResModel } from './../Modelos/catalogos/FiltroCatPalabrasResModel';
import { FiltroCatCategoriasModel } from './../Modelos/catalogos/FiltroCatCategoriasModel';
import { FiltroCatSubCategoriasModel } from './../Modelos/catalogos/FiltroCatSubcategoriasModel';
import { FiltroCatAvisosInfoModel } from './../Modelos/catalogos/FiltroCatAvisosInfoModel';
import { FiltroCatTipoVentaModel } from './../Modelos/catalogos/FiltroCatTipoVentaModel';
import { DenunciaModel } from './../Modelos/DenunciaModel';
import { FiltroCatTipoNegoModel } from './../Modelos/catalogos/FiltroCatTipoNegoModel';
import { HTTP } from '@ionic-native/http/ngx';


@Injectable({
  providedIn: 'root'
})
export class AccessPermissionService {
  url = `${AppSettings.API_ENDPOINT}`;

  constructor(
    private _http: HttpClient,
    private http: HTTP
  ) {
    this.http.setDataSerializer("utf8");
  }

  permisoAfiliacion(org: string, idUsuarioSistema: number): Observable<any> {
    const body = JSON.stringify({ "org": org, "user": idUsuarioSistema });
    return from(this.http.post(this.url + 'api/url/afiliacion/permitir', body,
      AppSettings.getHeadersToken())
      .then(data => {
        return JSON.parse(data.data);
      })
      .catch((error) => {
        return error;
      })).pipe(map(data => {
        return data;
      }));
  }

  plazaAcceso(plz: string): Observable<any> {
    const body = JSON.stringify({ "plz": plz });
    return from(this.http.post(this.url + 'api/url/plaza/permitir', body,
      AppSettings.getHeaders())
      .then(data => {
        return JSON.parse(data.data);
      })
      .catch((error) => {
        return error;
      })).pipe(map(data => {
        return data;
      }));
  }

  permisos(usuarioSistema: number): Observable<any> {
    const body = JSON.stringify({ "id_usuario_sistema": usuarioSistema });
    return from(this.http.post(this.url + 'api/user/permisos', body,
      AppSettings.getHeadersToken())
      .then(data => {
        return JSON.parse(data.data);
      })
      .catch((error) => {
        return error;
      })).pipe(map(data => {
        return data;
      }));
  }
}
