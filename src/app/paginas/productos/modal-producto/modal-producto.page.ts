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
  @Input() public unoProducto: ProductoModel;
  @Input() public user: any;

  slideOpts = {
    scrollbar: true,
  };
  constructor(
    private servicioProductos: ProductosService,
    public modalCtrl: ModalController,
    private negocioServico: NegocioService,
    private router: Router,
    private notificaciones: ToadNotificacionService
  ) {}

  ngOnInit() {
    console.log(this.unoProducto);

    if (this.existeSesion) {
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
        console.log(error);
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
          console.log(response.code);
        }
      },
      (error) => {}
    );
  }
  public agregar(producto: any) {
    this.negocioServico.buscarNegocio(producto.negocio.idNegocio).subscribe(
      (response) => {
        const contenido = JSON.parse(JSON.stringify(producto));
        const enviar = {
          producto: contenido,
          agregado: true,
        };
        this.router.navigate(["/tabs/negocio/" + response.data.url_negocio], {
          queryParams: { carrito: JSON.stringify(enviar) },
        });
        this.modalCtrl.dismiss({
          dismissed: true,
        });
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
