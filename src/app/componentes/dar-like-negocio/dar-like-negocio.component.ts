import { ProveedorServicioService } from "./../../api/busqueda/proveedores/proveedor-servicio.service";
import { ToadNotificacionService } from "./../../api/toad-notificacion.service";
import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import { MsNegocioModel } from "../../Modelos/busqueda/MsNegocioModel";
import { AlertController } from "@ionic/angular";
import { Router } from "@angular/router";

@Component({
  selector: "app-dar-like-negocio",
  templateUrl: "./dar-like-negocio.component.html",
  styleUrls: ["./dar-like-negocio.component.scss"],
})
export class DarLikeNegocioComponent implements OnInit {
  @Input() public negocio: any;
  @Input() public usuario: any;
  @Input() public mostrarLike: any;
  @Output() banderaAlert: EventEmitter<boolean> = new EventEmitter<boolean>();

  public loaderLike = false;

  constructor(
    private servicioNegocio: ProveedorServicioService,
    private notificacion: ToadNotificacionService, 
    private alertController: AlertController,
    private router: Router,
  ) {}

  ngOnInit() {}

  public async alerta(){
      const isAlert = true;
      this.banderaAlert.emit(isAlert);
  }

  public darLike(negocio: any) {
    if (!this.mostrarLike) {
      this.alerta();
    } else {
      
      this.loaderLike = true;
      if ( negocio.usuario_like !== 0){
        negocio.usuario_like = 0;
      }else {
        negocio.usuario_like = 1;
      }
      
      this.servicioNegocio.darLike(negocio, this.usuario).subscribe(
        (response) => {
          if (response.code === 200) {
            negocio.likes = response.data;
            negocio.usuario_like = 1;
          } else {
            negocio.likes = response.data;
            negocio.usuario_like = 0;
          }
          this.loaderLike = false;
        },
        (error) => {}
      );
    }
  }
}
