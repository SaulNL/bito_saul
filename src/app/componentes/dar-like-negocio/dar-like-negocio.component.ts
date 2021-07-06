import { ProveedorServicioService } from "./../../api/busqueda/proveedores/proveedor-servicio.service";
import { ToadNotificacionService } from "./../../api/toad-notificacion.service";
import { Component, Input, OnInit } from "@angular/core";
import { MsNegocioModel } from "../../Modelos/busqueda/MsNegocioModel";

@Component({
  selector: "app-dar-like-negocio",
  templateUrl: "./dar-like-negocio.component.html",
  styleUrls: ["./dar-like-negocio.component.scss"],
})
export class DarLikeNegocioComponent implements OnInit {
  @Input() public negocio: any;
  @Input() public usuario: any;
  @Input() public mostrarLike: any;

  constructor(
    private servicioNegocio: ProveedorServicioService,
    private notificacion: ToadNotificacionService
  ) {}

  ngOnInit() {}

  public darLike(negocio: any) {
    this.servicioNegocio.darLike(negocio, this.usuario).subscribe(
      (response) => {
        if (response.code === 200) {
          negocio.likes = response.data;
          negocio.usuario_like = 1;
          this.notificacion.exito(response.message);
        } else {
          negocio.likes = response.data;
          negocio.usuario_like = 0;
          this.notificacion.alerta(response.message);
        }
      },
      (error) => {}
    );
  }
}
