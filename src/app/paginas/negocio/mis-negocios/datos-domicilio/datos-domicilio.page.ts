import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NegocioModel } from "./../../../../Modelos/NegocioModel";
import { ActionSheetController } from "@ionic/angular";
import { ToadNotificacionService } from '../../../../api/toad-notificacion.service';
import { NegocioService } from "../../../../api/negocio.service";

@Component({
  selector: 'app-datos-domicilio',
  templateUrl: './datos-domicilio.page.html',
  styleUrls: ['./datos-domicilio.page.scss'],
})
export class DatosDomicilioPage implements OnInit {
  public negocioTO: NegocioModel;
  public valido: boolean;
  public negocioGuardar:any;
  constructor(private router: Router,
    private active: ActivatedRoute,
    private actionSheetController: ActionSheetController,
    private negocioServico: NegocioService,
    private notificaciones: ToadNotificacionService) {
      this.valido = false;
      this.negocioGuardar = new NegocioModel();
     }

  ngOnInit() {
    this.active.queryParams.subscribe(params => {
      if (params && params.special) {
        let datos = JSON.parse(params.special);
        this.negocioTO = datos.info;
        this.negocioGuardar = datos.pys;
      }
    });
  }
  datosD(){
    this.negocioGuardar.det_domicilio.latitud = this.negocioTO.det_domicilio.latitud;
    this.negocioGuardar.det_domicilio.longitud = this.negocioTO.det_domicilio.longitud;
    if(this.negocioTO.det_domicilio.id_domicilio != null){
      this.negocioGuardar.det_domicilio.id_domicilio = this.negocioTO.det_domicilio.id_domicilio;
    }
  }
  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: "Opciones",
      cssClass: "my-custom-class",
      buttons: [
        {
          text: "Editar",
          role: "save",
          handler: () => {
            this.valido = true;
          },
        },
        {
          text: "Cancel",
          icon: "close",
          
          handler: () => {this.valido=false;  },
        },
      ],
    });
    await actionSheet.present();
  }
  regresarMis() {
    this.negocioTO = JSON.parse(JSON.stringify(this.negocioTO));
    let navigationExtras = JSON.stringify(this.negocioTO);
    this.router.navigate(["/tabs/home/negocio/card-negocio"], {
      queryParams: { special: navigationExtras },
    });
  }

  regresar() {
    this.datosD();
    this.negocioTO = JSON.parse(JSON.stringify(this.negocioTO));
    this.negocioGuardar = JSON.parse(JSON.stringify(this.negocioGuardar));
    let all = {
      info: this.negocioTO,
      pys: this.negocioGuardar
    };
    let navigationExtras = JSON.stringify(all);
    this.router.navigate(["/tabs/home/negocio/mis-negocios/datos-contacto"], {
      queryParams: { special: navigationExtras },
    });
  }
  guardar() {
    this.datosD();
    this.negocioServico.guardar(this.negocioGuardar).subscribe(
      response => {        
        if (response.code === 200) {
          this.notificaciones.exito('Tu negocio se guardo exitosamente');
        } else {
          this.notificaciones.alerta('Error al guardar, intente nuevamente');
          //   this._notificacionService.pushAlert('Error al guardar, intente nuevamente');
          //  this.loaderGuardar = false;
        }
      },
      error => {
        this.notificaciones.error(error);
        //  this.loaderGuardar = false;
      }
    );
  }
}
