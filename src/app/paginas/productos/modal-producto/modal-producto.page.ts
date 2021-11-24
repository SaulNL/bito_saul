import { NegocioProductoModel } from './../../../Modelos/NegocioProductoModel';
import { FiltroNegocioModel } from './../../../Modelos/FiltroNegocioModel';
import { Component, Input, OnInit } from "@angular/core";
import { ProductoModel } from "../../../Modelos/ProductoModel";
import { ModalController } from "@ionic/angular";
import { NegocioService } from "../../../api/negocio.service";
import { Router } from "@angular/router";
import { ProductosService } from "../../../api/productos.service";
import { ToadNotificacionService } from "../../../api/toad-notificacion.service";
import { OptionBackLogin } from "src/app/Modelos/OptionBackLoginModel";

@Component({
  selector: "app-modal-producto",
  templateUrl: "./modal-producto.page.html",
  styleUrls: ["./modal-producto.page.scss"],
})
export class ModalProductoPage implements OnInit {
  @Input() public existeSesion: boolean;
  @Input() public unoProducto: any;
  @Input() public user: any;
  // public busquedaNegocio: FiltroNegocioModel;
  public negocio: NegocioProductoModel;
  public comprarB: any;
  public mensajeCompra = 'Agregar';
  public typeLogin: OptionBackLogin;
  public loader: boolean;
  public idPersona: number | null;
  public cargaFallidaMensaje: string;
  public cargando: string;
  constructor(
    private servicioProductos: ProductosService,
    public modalCtrl: ModalController,
    private negocioServico: NegocioService,
    private router: Router,
    private notificaciones: ToadNotificacionService
  ) {
    this.cargando = 'Cargando producto';
    this.idPersona = null;
    this.loader = false;
    this.comprarB = false;
  }

  ngOnInit() {
    this.typeLogin = new OptionBackLogin();
    if (this.existeSesion) {
      this.idPersona = this.user.id_persona;
      this.loVio(this.unoProducto);
    }
    // this.busquedaNegocio = new FiltroNegocioModel(this.unoProducto.negocio.idNegocio, this.idPersona);
    this.obtenerNegocio(this.unoProducto.negocio.idNegocio);
  }
  dismiss() {
    this.modalCtrl.dismiss();
  }

  verMas() {
    this.router.navigate(["/tabs/negocio/" + this.negocio.url_negocio], {
      queryParams: { route: true },
    });
    this.modalCtrl.dismiss({
      dismissed: true
    });
  }


  public loVio(producto) {
    let objectoVio = {
      id_persona: this.user.id_persona, //usuario
      id_producto: producto.idProducto, //idProducto
    };
    this.servicioProductos.quienVioProdu(objectoVio).subscribe();
  }
  public agregar(producto: any) {
    const contenido = JSON.parse(JSON.stringify(producto));
    const enviar = {
      producto: contenido,
      agregado: true,
    };
    this.router.navigate(["/tabs/negocio/" + this.negocio.url_negocio], {
      queryParams: { carrito: JSON.stringify(enviar) },
    });
    this.modalCtrl.dismiss({
      dismissed: true,
    });
  }

  public obtenerNegocio(idNegocio: number) {
    this.loader = true;
    this.negocioServico.obtenerNegocio(idNegocio).subscribe(
      respuesta => {
        if (respuesta.code === 200) {
          this.negocio = respuesta.data.lst_cat_negocios[0];
          this.mostrarBoton();
        } else {
          this.notificaciones.error('Error no se pudo cargar su producto');
          this.dismiss();
        }
        this.loader = false;
      }, () => {
        this.loader = false;
        this.notificaciones.error('Error problemas con el servidor');
        this.dismiss();
      }
    );
  }
  public mostrarBoton() {
    this.comprarB = (this.negocio.entrega_domicilio === 1 || this.negocio.entrega_sitio === 1 || this.negocio.consumo_sitio === 1) && parseInt(this.unoProducto.precio) > 0;
  }

  public noEstaAbierto() {
    this.mensajeCompra = 'Este negocio se encuentra cerrado';
  }
}
