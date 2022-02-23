import { SendLikeProductInterface } from "../Bitoo/models/product-like-model";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AppSettings } from "../AppSettings";
import { map } from "rxjs/operators";
import { Observable, from } from "rxjs";
import { FiltrosModel } from "../Modelos/FiltrosModel";
import { FiltroABCModel } from "../Modelos/FiltroABCModel";
import { ProductoModel } from "../Modelos/ProductoModel";
import { UsuarioSistemaModel } from "../Modelos/UsuarioSistemaModel";
import { HTTP } from "@ionic-native/http/ngx";
import { VioProductoModel } from "../Modelos/busqueda/VioProductoModel";
@Injectable({
  providedIn: "root",
})
export class ProductosService {
  url = `${AppSettings.API_ENDPOINT}`;
  constructor(private _http: HttpClient, private http: HTTP) {}
  /**
   * Funcion para obtener los productos
   * @author Omar
   */
  public obtenerProductos(filtro: FiltroABCModel): Observable<any> {
    const body = JSON.stringify(filtro);
    this.http.setDataSerializer("utf8");
    return from(
      this.http
        .post(
          this.url + "api/productos/obtener",
          body,
          AppSettings.getHeaders()
        )
        .then((data) => {
          return JSON.parse(data.data);
        })
        .catch((error) => {
          return error;
        })
    ).pipe(
      map((data) => {
        return data;
      })
    );
  }

  /**
   * Funcion para obtener las iniciales de los filtros
   * @param filtros
   * @author Paola Coba
   */
  public obtenerIniciales(filtros: FiltrosModel): Observable<any> {
    const body = JSON.stringify(filtros);
    this.http.setDataSerializer("utf8");
    return from(
      this.http
        .post(
          this.url + "api/productos/obtenerIniciales",
          body,
          AppSettings.getHeaders()
        )
        .then((data) => {
          return JSON.parse(data.data);
        })
        .catch((error) => {
          return error;
        })
    ).pipe(
      map((data) => {
        return data;
      })
    );
  }

  /**
   * Funcion para obtener el negocio
   * @param negocio
   * @author Omar
   */
  public obtenerNegocioById(id_negocio: number): Observable<any> {
    const body = JSON.stringify({ id_negocio: id_negocio });
    return this._http
      .post(this.url + "api/productos/obtener/negocio", body, {
        headers: AppSettings.getHeaders(),
      })
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  /**
   * Servicio para dar like
   * @author Omar
   * @param producto
   * @param usuario
   */
  public darLike(
    producto: ProductoModel,
    usuario: UsuarioSistemaModel
  ): Observable<any> {
    const body = JSON.stringify({ producto: producto, usuario: usuario });
    return from(
      this.http
        .post(
          this.url + "api/productos/dar_like",
          body,
          AppSettings.getHeadersToken()
        )
        .then((data) => {
          return JSON.parse(data.data);
        })
        .catch((error) => {
          return error;
        })
    ).pipe(
      map((data) => {
        return data;
      })
    );
  }
  /**
   * @author Juan Antonio Guevara Flores
   * @description Da like o da dislike a un producto
   * @param likeProduct
   * @returns Observable<any>
   */
  public likeProduct(likeProduct: SendLikeProductInterface): Observable<any> {
    const body = JSON.stringify(likeProduct);
    return from(
      this.http
        .post(
          this.url + "api/productos/dar_like",
          body,
          AppSettings.getHeadersToken()
        )
        .then((data) => {
          return JSON.parse(data.data);
        })
        .catch((error) => {
          return error;
        })
    ).pipe(
      map((data) => {
        return data;
      })
    );
  }

  public quienVioProdu(prod: VioProductoModel): Observable<any> {
    const body = JSON.stringify(prod);
    return from(
      this.http
        .post(
          this.url + "api/producto/visto/usuario",
          body,
          AppSettings.getHeadersToken()
        )
        .then((data) => {
          return JSON.parse(data.data);
        })
        .catch((error) => {
          return error;
        })
    ).pipe(
      map((data) => {
        return data;
      })
    );
  }
}
