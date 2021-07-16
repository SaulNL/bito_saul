import { Component, Input, OnInit } from "@angular/core";
import { ProductoModel } from "../../../Modelos/ProductoModel";
import { ModalController } from "@ionic/angular";
import { NegocioService } from "../../../api/negocio.service";
import { Router } from "@angular/router";
import { ProductosService } from "../../../api/productos.service";
import { ToadNotificacionService } from "../../../api/toad-notificacion.service";

@Component({
  selector: "app-modal-producto",
  templateUrl: "./modal-producto.page.html",
  styleUrls: ["./modal-producto.page.scss"],
})
export class ModalProductoPage implements OnInit {
  @Input() public existeSesion: boolean;
  @Input() public unoProducto: any;
  @Input() public user: any;
  public negocio: any;
  public informacionNegocio: any;
  public comprarB: any;

  constructor(
    private servicioProductos: ProductosService,
    public modalCtrl: ModalController,
    private negocioServico: NegocioService,
    private router: Router,
    private notificaciones: ToadNotificacionService
  ) { }

  ngOnInit() {
    if (this.existeSesion) {
      this.obtenerInformacionNegocio();
      this.loVio(this.unoProducto);
    }
  }
  dismiss() {
    this.modalCtrl.dismiss();
  }

  verMas(producto: ProductoModel) {
    this.negocioServico.buscarNegocio(producto.negocio.idNegocio).subscribe(
      (response) => {
        this.router.navigate(["/tabs/negocio/" + response.data.url_negocio], {
          queryParams: { route: true },
        });
        this.modalCtrl.dismiss({
          dismissed: true,
        });
      },
      (error) => {

      }
    );
  }
  login() {
    this.router.navigate(["/tabs/login"]);
    this.modalCtrl.dismiss({
      dismissed: true,
    });
  }
  public loVio(producto) {
    let objectoVio = {
      id_persona: this.user.id_persona, //usuario
      id_producto: producto.idProducto, //idProducto
    };
    this.servicioProductos.quienVioProdu(objectoVio).subscribe(
      (response) => {
        if (response.code === 200) {

        }
      },
      (error) => { }
    );
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
  obtenerInformacionNegocio() {
     this.negocioServico.buscarNegocio(this.unoProducto.negocio.idNegocio).subscribe(
      (response) => {
            this.negocio = response.data;
            this.negocioUrl(response.data);
      },
      (error) => {
      }
    );
  }
  public negocioUrl(negocioT: any){
     this.negocioServico.obteneretalleNegocio(negocioT.url_negocio, this.user.id_persona).subscribe(
        (response) => {
            this.informacionNegocio = response.data;
            this.mostrarBoton();
        },
        (error) => {

        }
    );
  }

  public mostrarBoton() {
    this.comprarB = ( (this.informacionNegocio.entrega_domicilio === 1 || this.informacionNegocio.entrega_sitio === 1 ||
    this.informacionNegocio.consumo_sitio === 1) && parseInt(this.unoProducto.precio) > 0 );
  }
}
