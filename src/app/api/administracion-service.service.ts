import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {from, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import { FiltroCatVariableModel } from './../Modelos/catalogos/FiltroCatVariableModel';
import { FiltroCatOrgModel } from './../Modelos/catalogos/FiltroCatOrgModel';
import {AppSettings} from '../AppSettings';
import { FiltroCatRolModel } from './../Modelos/catalogos/FiltroCatRolModel';
import { FiltroCatPermisosModel } from './../Modelos/catalogos/FiltroCatPermisosModel';
import { FiltroCatPalabrasResModel } from './../Modelos/catalogos/FiltroCatPalabrasResModel';
import {FiltroCatCategoriasModel} from './../Modelos/catalogos/FiltroCatCategoriasModel';
import {FiltroCatSubCategoriasModel} from './../Modelos/catalogos/FiltroCatSubcategoriasModel';
import { FiltroCatAvisosInfoModel } from './../Modelos/catalogos/FiltroCatAvisosInfoModel';
import { FiltroCatTipoVentaModel } from './../Modelos/catalogos/FiltroCatTipoVentaModel';
import { DenunciaModel } from './../Modelos/DenunciaModel';
import { FiltroCatTipoNegoModel } from './../Modelos/catalogos/FiltroCatTipoNegoModel';
import { HTTP } from '@ionic-native/http/ngx';

@Injectable({
  providedIn: 'root'
})
export class AdministracionService {
  url = `${AppSettings.API_ENDPOINT}`;
  constructor(
    private _http: HttpClient,
    private http: HTTP
  ) {
    this.http.setDataSerializer("utf8");
   }

  /*CATALOGO VARIABLE*/
  guardarVarible(filtro: FiltroCatVariableModel): Observable<any> {
    const body = JSON.stringify(filtro);
    return from(this.http.post( this.url + 'api/admin/catalogos/guardar/guarda_variable',body,
    AppSettings.getHeadersToken())
    .then( data => {
        return JSON.parse(data.data);
    })
    .catch((error) => {
        return error;
    })).pipe(map(data => {
        return data;
    }));
  }
  obtenerVariable(filtro: FiltroCatVariableModel): Observable<any> {
    const body = JSON.stringify(filtro);
    return from(this.http.post( this.url + 'api/catalogos/adminUser/list_variables',body,
    AppSettings.getHeadersToken())
    .then( data => {
        return JSON.parse(data.data);
    })
    .catch((error) => {
        return error;
    })).pipe(map(data => {
        return data;
    }));
  }
   listarVariables(): Observable<any> {
    const body = JSON.stringify({});
    return from(this.http.post( this.url + 'api/catalogos/adminUser/list_variables',body,
    AppSettings.getHeadersToken())
    .then( data => {
        return JSON.parse(data.data);
    })
    .catch((error) => {
        return error;
    })).pipe(map(data => {
        return data;
    }));
  }
  eliminarVariable(id_variable: number):Observable<any> {
    const body = JSON.stringify({'id_variable': id_variable});
    return from(this.http.post( this.url + 'api/catalogos/adminUser/eliminar_variable',body,
    AppSettings.getHeadersToken())
    .then( data => {
        return JSON.parse(data.data);
    })
    .catch((error) => {
        return error;
    })).pipe(map(data => {
        return data;
    }));
  }
  buscarVariable(id_variable: number):Observable<any> {
    const body = JSON.stringify({'id_variable': id_variable});
    return from(this.http.post( this.url + 'api/catalogos/adminUser/buscar_variable',body,
    AppSettings.getHeadersToken())
    .then( data => {
        return JSON.parse(data.data);
    })
    .catch((error) => {
        return error;
    })).pipe(map(data => {
        return data;
    }));
  }
  /*CATALOGO ROL*/
  obtenerRol(filtro: FiltroCatRolModel): Observable<any> {
    const body = JSON.stringify(filtro);
    return from(this.http.post( this.url + 'api/catalogos/adminUser/listaRoles',body,
    AppSettings.getHeadersToken())
    .then( data => {
        return JSON.parse(data.data);
    })
    .catch((error) => {
        return error;
    })).pipe(map(data => {
        return data;
    }));
  }
  listarRol(): Observable<any> {
    const body = JSON.stringify({});
    return from(this.http.post( this.url + 'api/catalogos/adminUser/listaRoles',body,
    AppSettings.getHeadersToken())
    .then( data => {
        return JSON.parse(data.data);
    })
    .catch((error) => {
        return error;
    })).pipe(map(data => {
        return data;
    }));
  }
  eliminarRol(id_rol: number):Observable<any> {
    const body = JSON.stringify({'id_rol': id_rol});
    return from(this.http.post( this.url + 'api/catalogos/adminUser/eliminarRol',body,
    AppSettings.getHeadersToken())
    .then( data => {
        return JSON.parse(data.data);
    })
    .catch((error) => {
        return error;
    })).pipe(map(data => {
        return data;
    }));
  }
  buscarRol(id_rol: number):Observable<any> {
    const body = JSON.stringify({'id_rol': id_rol});
    return from(this.http.post( this.url + 'api/catalogos/adminUser/buscarRol',body,
    AppSettings.getHeadersToken())
    .then( data => {
        return JSON.parse(data.data);
    })
    .catch((error) => {
        return error;
    })).pipe(map(data => {
        return data;
    }));
  }
  guardarRol(filtro: FiltroCatRolModel): Observable<any> {
    const body = JSON.stringify(filtro);
    return from(this.http.post( this.url + 'api/admin/catalogos/guardar/catRol',body,
    AppSettings.getHeadersToken())
    .then( data => {
        return JSON.parse(data.data);
    })
    .catch((error) => {
        return error;
    })).pipe(map(data => {
        return data;
    }));
  }
  /*CATALOGO PERMISOS*/
  obtenerPermiso(filtro: FiltroCatPermisosModel): Observable<any> {
    const body = JSON.stringify(filtro);
    return from(this.http.post( this.url + 'api/catalogos/adminUser/listPermisos',body,
    AppSettings.getHeadersToken())
    .then( data => {
        return JSON.parse(data.data);
    })
    .catch((error) => {
        return error;
    })).pipe(map(data => {
        return data;
    }));
  }
  listarPermiso(): Observable<any> {
    const body = JSON.stringify({});
    return from(this.http.post( this.url + 'api/catalogos/adminUser/listPermisos',body,
    AppSettings.getHeadersToken())
    .then( data => {
        return JSON.parse(data.data);
    })
    .catch((error) => {
        return error;
    })).pipe(map(data => {
        return data;
    }));
  }
  eliminarPermiso(id_permiso: number):Observable<any> {
    const body = JSON.stringify({'id_permiso': id_permiso});
    return from(this.http.post( this.url + 'api/catalogos/adminUser/eliminarPermisos',body,
    AppSettings.getHeadersToken())
    .then( data => {
        return JSON.parse(data.data);
    })
    .catch((error) => {
        return error;
    })).pipe(map(data => {
        return data;
    }));
  }
  buscarPermiso(id_permiso: number):Observable<any> {
    const body = JSON.stringify({'id_permiso': id_permiso});
    return from(this.http.post( this.url + 'api/catalogos/adminUser/buscarPermisos',body,
    AppSettings.getHeadersToken())
    .then( data => {
        return JSON.parse(data.data);
    })
    .catch((error) => {
        return error;
    })).pipe(map(data => {
        return data;
    }));
  }
  guardarPermiso(filtro: FiltroCatPermisosModel): Observable<any> {
    const body = JSON.stringify(filtro);
    return from(this.http.post( this.url + 'api/admin/catalogos/guardar/catPermisos',body,
    AppSettings.getHeadersToken())
    .then( data => {
        return JSON.parse(data.data);
    })
    .catch((error) => {
        return error;
    })).pipe(map(data => {
        return data;
    }));
  }
  /*CATALOGO DE PALABRAS RESERVADAS*/
  obtenerPalabrasReservadas(filtro: FiltroCatPalabrasResModel): Observable<any> {
    const body = JSON.stringify(filtro);
    return from(this.http.post( this.url + 'api/admin/catalogos/adminUser/catPalabrasReservadas',body,
    AppSettings.getHeadersToken())
    .then( data => {
        return JSON.parse(data.data);
    })
    .catch((error) => {
        return error;
    })).pipe(map(data => {
        return data;
    }));
  }
  listarPalabrasReservadas(): Observable<any> {
    const body = JSON.stringify({});
    return from(this.http.post( this.url + 'api/admin/catalogos/adminUser/catPalabrasReservadas',body,
    AppSettings.getHeadersToken())
    .then( data => {
        return JSON.parse(data.data);
    })
    .catch((error) => {
        return error;
    })).pipe(map(data => {
        return data;
    }));
  }
  eliminarPalabraReservada(id_palabra: number): Observable<any> {
    const body = JSON.stringify({'id_palabra': id_palabra});
    return from(this.http.post( this.url + 'api/catalogos/adminUser/eliminarPalabra',body,
    AppSettings.getHeadersToken())
    .then( data => {
        return JSON.parse(data.data);
    })
    .catch((error) => {
        return error;
    })).pipe(map(data => {
        return data;
    }));
  }
  guardarPalabraReservada(filtro: FiltroCatPalabrasResModel): Observable<any> {
    const body = JSON.stringify(filtro);
    return from(this.http.post( this.url + 'api/admin/catalogos/guardar/PalabrasReservadas',body,
    AppSettings.getHeadersToken())
    .then( data => {
        return JSON.parse(data.data);
    })
    .catch((error) => {
        return error;
    })).pipe(map(data => {
        return data;
    }));
  }
  validarPalabraReservada(palabra: any): Observable<any> {
    const body = JSON.stringify(palabra);
    return from(this.http.post( this.url + 'api/admin/catalogos/cambiarEstatus/PalabrasReservadas',body,
    AppSettings.getHeadersToken())
    .then( data => {
        return JSON.parse(data.data);
    })
    .catch((error) => {
        return error;
    })).pipe(map(data => {
        return data;
    }));
  }
  /*CATALOGO ORGANIZACION*/
  obtenerOrganizacion(filtro: FiltroCatOrgModel): Observable<any> {
    const body = JSON.stringify(filtro);
    return from(this.http.post( this.url + 'api/catalogos/adminUser/list_organizaciones',body,
    AppSettings.getHeadersToken())
    .then( data => {
        return JSON.parse(data.data);
    })
    .catch((error) => {
        return error;
    })).pipe(map(data => {
        return data;
    }));
  }
  listarOrganizaciones(): Observable<any> {
    const body = JSON.stringify({});
    return from(this.http.post( this.url + 'api/catalogos/adminUser/list_organizaciones',body,
    AppSettings.getHeadersToken())
    .then( data => {
        return JSON.parse(data.data);
    })
    .catch((error) => {
        return error;
    })).pipe(map(data => {
        return data;
    }));
  }
  eliminarOrganizacion(id_organizacion: number):Observable<any> {
    const body = JSON.stringify({'id_organizacion': id_organizacion});
    return from(this.http.post( this.url + 'api/catalogos/adminUser/eliminar_organizaciones',body,
    AppSettings.getHeadersToken())
    .then( data => {
        return JSON.parse(data.data);
    })
    .catch((error) => {
        return error;
    })).pipe(map(data => {
        return data;
    }));
  }
  buscarOrganizacion(id_organizacion: number):Observable<any> {
    const body = JSON.stringify({'id_organizacion': id_organizacion});
    return from(this.http.post( this.url + 'api/catalogos/adminUser/buscar_organizacion',body,
    AppSettings.getHeadersToken())
    .then( data => {
        return JSON.parse(data.data);
    })
    .catch((error) => {
        return error;
    })).pipe(map(data => {
        return data;
    }));
  }
  guardarCatOrganizacion(filtro: FiltroCatOrgModel): Observable<any> {
    const body = JSON.stringify(filtro);
    return from(this.http.post( this.url + 'api/admin/catalogos/guardar/opganizacion',body,
    AppSettings.getHeadersToken())
    .then( data => {
        return JSON.parse(data.data);
    })
    .catch((error) => {
        return error;
    })).pipe(map(data => {
        return data;
    }));
  }
  /*CATALOGO AVISOS DE INFORMACIÓN*/
  obtenerAviso(filtro: FiltroCatAvisosInfoModel): Observable<any> {
    const body = JSON.stringify(filtro);
    return from(this.http.post( this.url + 'api/catalogos/adminUser/listAvisos',body,
    AppSettings.getHeadersToken())
    .then( data => {
        return JSON.parse(data.data);
    })
    .catch((error) => {
        return error;
    })).pipe(map(data => {
        return data;
    }));
  }
  listarAviso(): Observable<any> {
    const body = JSON.stringify({});
    return from(this.http.post( this.url + 'api/catalogos/adminUser/listAvisos',body,
    AppSettings.getHeadersToken())
    .then( data => {
        return JSON.parse(data.data);
    })
    .catch((error) => {
        return error;
    })).pipe(map(data => {
        return data;
    }));
  }
  guardarAviso(filtro: FiltroCatAvisosInfoModel): Observable<any> {
    const body = JSON.stringify(filtro);
    return from(this.http.post( this.url + 'api/catalogos/adminUser/guardar/catAviso',body,
    AppSettings.getHeadersToken())
    .then( data => {
        return JSON.parse(data.data);
    })
    .catch((error) => {
        return error;
    })).pipe(map(data => {
        return data;
    }));
  }
  eliminarAviso(id_aviso: number): Observable<any> {
    const body = JSON.stringify({'id_aviso': id_aviso});
    return from(this.http.post( this.url + 'api/catalogos/adminUser/eliminarAviso',body,
    AppSettings.getHeadersToken())
    .then( data => {
        return JSON.parse(data.data);
    })
    .catch((error) => {
        return error;
    })).pipe(map(data => {
        return data;
    }));
  }
  validarAviso(aviso: any): Observable<any> {
    const body = JSON.stringify(aviso);
    return from(this.http.post( this.url + 'api/catalogos/adminUser/cambiarEstatusAviso',body,
    AppSettings.getHeadersToken())
    .then( data => {
        return JSON.parse(data.data);
    })
    .catch((error) => {
        return error;
    })).pipe(map(data => {
        return data;
    }));
  }
  guardarPopever(filtro: FiltroCatAvisosInfoModel): Observable<any> {
    const body = JSON.stringify(filtro);
    return from(this.http.post( this.url + 'api/catalogos/adminUser/guardar/catAvisoPopover',body,
    AppSettings.getHeadersToken())
    .then( data => {
        return JSON.parse(data.data);
    })
    .catch((error) => {
        return error;
    })).pipe(map(data => {
        return data;
    }));
  }
   /*CATALOGO CATEGORIA*/
   obtenerCategoria(filtro: FiltroCatCategoriasModel): Observable<any> {
    const body = JSON.stringify(filtro);
    return from(this.http.post( this.url + 'api/catalogos/adminUser/listGiro',body,
    AppSettings.getHeadersToken())
    .then( data => {
        return JSON.parse(data.data);
    })
    .catch((error) => {
        return error;
    })).pipe(map(data => {
        return data;
    }));
  }
  listarCategoria(): Observable<any> {
    const body = JSON.stringify({});
    return from(this.http.post( this.url + 'api/catalogos/adminUser/listGiro',body,
    AppSettings.getHeadersToken())
    .then( data => {
        return JSON.parse(data.data);
    })
    .catch((error) => {
        return error;
    })).pipe(map(data => {
        return data;
    }));
  }
  eliminarCategoria(id_giro: number): Observable<any> {
    const body = JSON.stringify({'id_giro': id_giro});
    return from(this.http.post( this.url + 'api/catalogos/adminUser/eliminarGiro',body,
    AppSettings.getHeadersToken())
    .then( data => {
        return JSON.parse(data.data);
    })
    .catch((error) => {
        return error;
    })).pipe(map(data => {
        return data;
    }));
  }
  buscarCategoria(id_giro: number): Observable<any> {
    const body = JSON.stringify({'id_giro': id_giro});
    return from(this.http.post( this.url + 'api/catalogos/adminUser/buscarGiro',body,
    AppSettings.getHeadersToken())
    .then( data => {
        return JSON.parse(data.data);
    })
    .catch((error) => {
        return error;
    })).pipe(map(data => {
        return data;
    }));
  }
  guardarCategoria(filtro: FiltroCatCategoriasModel): Observable<any> {
    const body = JSON.stringify(filtro);
    return from(this.http.post( this.url + 'api/admin/catalogos/guardar/catGiro',body,
    AppSettings.getHeadersToken())
    .then( data => {
        return JSON.parse(data.data);
    })
    .catch((error) => {
        return error;
    })).pipe(map(data => {
        return data;
    }));
  }
  listaSubcategoriaCategoria(id_giro: number): Observable<any> {
    const body = JSON.stringify({'id_giro': id_giro});
    return from(this.http.post( this.url + 'api/catalogos/adminUser/listGirosId',body,
    AppSettings.getHeadersToken())
    .then( data => {
        return JSON.parse(data.data);
    })
    .catch((error) => {
        return error;
    })).pipe(map(data => {
        return data;
    }));
  }
    /*CATALOGO SUBCATEGORIA*/
    obtenerSubcate(filtro: FiltroCatSubCategoriasModel): Observable<any> {
      const body = JSON.stringify(filtro);
      return from(this.http.post( this.url + 'api/catalogos/adminUser/listCategorias',body,
      AppSettings.getHeadersToken())
      .then( data => {
          return JSON.parse(data.data);
      })
      .catch((error) => {
          return error;
      })).pipe(map(data => {
          return data;
      }));
    }
    listarSubcategoria(): Observable<any> {
      const body = JSON.stringify({});
      return from(this.http.post( this.url + 'api/catalogos/adminUser/listCategorias',body,
      AppSettings.getHeadersToken())
      .then( data => {
          return JSON.parse(data.data);
      })
      .catch((error) => {
          return error;
      })).pipe(map(data => {
          return data;
      }));
    }
    eliminarSubcategoria(id_categoria: number): Observable<any> {
      const body = JSON.stringify({'id_categoria': id_categoria});
      return from(this.http.post( this.url + 'api/catalogos/adminUser/eliminarCategoria',body,
      AppSettings.getHeadersToken())
      .then( data => {
          return JSON.parse(data.data);
      })
      .catch((error) => {
          return error;
      })).pipe(map(data => {
          return data;
      }));
    }
    buscarSubcategoria(id_categoria: number): Observable<any> {
      const body = JSON.stringify({'id_categoria': id_categoria});
      return from(this.http.post( this.url + 'api/catalogos/adminUser/buscarCategoria',body,
      AppSettings.getHeadersToken())
      .then( data => {
          return JSON.parse(data.data);
      })
      .catch((error) => {
          return error;
      })).pipe(map(data => {
          return data;
      }));
    }
    guardarSubcategoria(filtro: FiltroCatSubCategoriasModel): Observable<any> {
      const body = JSON.stringify(filtro);
      return from(this.http.post( this.url + 'api/admin/catalogos/guardar/catCategoria',body,
      AppSettings.getHeadersToken())
      .then( data => {
          return JSON.parse(data.data);
      })
      .catch((error) => {
          return error;
      })).pipe(map(data => {
          return data;
      }));
    }
    listarTipoNego(): Observable<any> {
      const body = JSON.stringify({});
      return from(this.http.post( this.url + 'api/catalogos/adminUser/listNegocio',body,
      AppSettings.getHeadersToken())
      .then( data => {
          return JSON.parse(data.data);
      })
      .catch((error) => {
          return error;
      })).pipe(map(data => {
          return data;
      }));
    }
    /*GUARDAR DENUNCIA PARA NEGOCIO */
  guardarDenunciaNegocio(denuncia: DenunciaModel): Observable<any> {
    const body = JSON.stringify(denuncia);
    this.http.setDataSerializer("utf8");
    return from(this.http.post(
      this.url + 'api/servicios/denunciar/enviar', body,AppSettings.getHeadersToken())
      .then((data) => {
        return JSON.parse(data.data);
      })
      .catch((error) => {
        return error;
      }));
  }
  /*OBTENER LA LISTA  DE DENUNCIAS */
  obtenerDenuncias(): Observable<any> {
    const body = JSON.stringify({});
    return from(this.http.post(  this.url + 'api/servicios/denunciar/cunsulta',body,
    AppSettings.getHeadersToken())
    .then( data => {
        return JSON.parse(data.data);
    })
    .catch((error) => {
        return error;
    })).pipe(map(data => {
        return data;
    }));
  }
busquedaNegocioDenuncias(nombre_comercial: string): Observable<any> {
    const body = JSON.stringify({'nombre_comercial': nombre_comercial});
    return from(this.http.post( this.url + 'api/servicios/denunciar/cunsulta',body,
    AppSettings.getHeadersToken())
    .then( data => {
        return JSON.parse(data.data);
    })
    .catch((error) => {
        return error;
    })).pipe(map(data => {
        return data;
    }));
  }
  /*CATALOGO TIPO VENTA*/
  obtenerTipoVenta(filtro: FiltroCatTipoVentaModel): Observable<any> {
    const body = JSON.stringify(filtro);
    return from(this.http.post( this.url + 'api/catalogos/adminUser/listVenta',body,
    AppSettings.getHeadersToken())
    .then( data => {
        return JSON.parse(data.data);
    })
    .catch((error) => {
        return error;
    })).pipe(map(data => {
        return data;
    }));
  }
  listarTipoVenta(): Observable<any> {
    const body = JSON.stringify({});
    return from(this.http.post( this.url + 'api/catalogos/adminUser/listVenta',body,
    AppSettings.getHeadersToken())
    .then( data => {
        return JSON.parse(data.data);
    })
    .catch((error) => {
        return error;
    })).pipe(map(data => {
        return data;
    }));
  }
  eliminarTipoVenta(id_tipo_venta: number): Observable<any> {
    const body = JSON.stringify({'id_tipo_venta': id_tipo_venta});
    return from(this.http.post( this.url + 'api/catalogos/adminUser/eliminarVenta',body,
    AppSettings.getHeadersToken())
    .then( data => {
        return JSON.parse(data.data);
    })
    .catch((error) => {
        return error;
    })).pipe(map(data => {
        return data;
    }));
  }
  buscarTipoVenta(id_tipo_venta: number): Observable<any> {
    const body = JSON.stringify({'id_tipo_venta': id_tipo_venta});
    return from(this.http.post( this.url + 'api/catalogos/adminUser/buscarVenta',body,
    AppSettings.getHeadersToken())
    .then( data => {
        return JSON.parse(data.data);
    })
    .catch((error) => {
        return error;
    })).pipe(map(data => {
        return data;
    }));
  }
  guardarTipoVenta(filtro: FiltroCatTipoVentaModel): Observable<any> {
    const body = JSON.stringify(filtro);
    return from(this.http.post( this.url + 'api/admin/catalogos/guardar/catTipoVenta',body,
    AppSettings.getHeadersToken())
    .then( data => {
        return JSON.parse(data.data);
    })
    .catch((error) => {
        return error;
    })).pipe(map(data => {
        return data;
    }));
  }
  /*CATALOGO TIPO NEGOCIO*/
  obtenerTipoNego(filtro: FiltroCatTipoNegoModel): Observable<any> {
    const body = JSON.stringify(filtro);
    return from(this.http.post( this.url + 'api/catalogos/adminUser/listNegocio',body,
    AppSettings.getHeadersToken())
    .then( data => {
        return JSON.parse(data.data);
    })
    .catch((error) => {
        return error;
    })).pipe(map(data => {
        return data;
    }));
  }
  eliminarTipoNego(id_tipo_negocio: number): Observable<any> {
    const body = JSON.stringify({'id_tipo_negocio': id_tipo_negocio});
    return from(this.http.post( this.url + 'api/catalogos/adminUser/eliminarNegocio',body,
    AppSettings.getHeadersToken())
    .then( data => {
        return JSON.parse(data.data);
    })
    .catch((error) => {
        return error;
    })).pipe(map(data => {
        return data;
    }));
  }
  buscarTipoNego(id_tipo_negocio: number): Observable<any> {
    const body = JSON.stringify({'id_tipo_negocio': id_tipo_negocio});
    return from(this.http.post( this.url + 'api/catalogos/adminUser/buscarNegocio',body,
    AppSettings.getHeadersToken())
    .then( data => {
        return JSON.parse(data.data);
    })
    .catch((error) => {
        return error;
    })).pipe(map(data => {
        return data;
    }));
  }
  guardarTipoNego(filtro: FiltroCatTipoNegoModel): Observable<any> {
    const body = JSON.stringify(filtro);
    return from(this.http.post( this.url + 'api/admin/catalogos/guardar/catTipoNegocio',body,
    AppSettings.getHeadersToken())
    .then( data => {
        return JSON.parse(data.data);
    })
    .catch((error) => {
        return error;
    })).pipe(map(data => {
        return data;
    }));
  }
  /**
   * Funcion para enviar solicitud cambio url negocio por correo
   * @param datos
   * @author Kenedy
   */
  enviarCambioUrlCorreo(datos:any): Observable<any>{
    const body = JSON.stringify(datos);
    return from(this.http.post( this.url + 'api/solicitud/cambiourl',body,
    AppSettings.getHeadersToken())
    .then( data => {
        return JSON.parse(data.data);
    })
    .catch((error) => {
        return error;
    })).pipe(map(data => {
        return data;
    }));
  }
}
