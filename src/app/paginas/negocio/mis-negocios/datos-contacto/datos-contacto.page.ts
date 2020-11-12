import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { NegocioModel } from "./../../../../Modelos/NegocioModel";
import { ActionSheetController } from "@ionic/angular";
import { ToadNotificacionService } from '../../../../api/toad-notificacion.service';
import { NegocioService } from "../../../../api/negocio.service";

@Component({
  selector: "app-datos-contacto",
  templateUrl: "./datos-contacto.page.html",
  styleUrls: ["./datos-contacto.page.scss"],
})
export class DatosContactoPage implements OnInit {
  public negocioTO: NegocioModel;
  public valido: boolean;
  public variaf: boolean;
  public variat: boolean;
  public variay: boolean;
  public variai: boolean;
  public variak: boolean;
  public datos: any;
  public iden: any;
  public negocioGuardar: any;
  public nuevoPS: any;
  constructor(
    private router: Router,
    private active: ActivatedRoute,
    private actionSheetController: ActionSheetController,
    private negocioServico: NegocioService,
    private notificaciones: ToadNotificacionService
  ) {
    this.valido = false;
    this.variaf = false;
    this.variat = false;
    this.variay = false;
    this.variai = false;
    this.variak = false;
  }

  ngOnInit() {
    this.active.queryParams.subscribe((params) => {
      if (params && params.special) {
        this.datos = JSON.parse(params.special);
        this.negocioTO = this.datos.info;
        this.negocioGuardar = this.datos.pys;
      }
    });
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

  regresar() {
    this.datosC();
    this.negocioTO = JSON.parse(JSON.stringify(this.negocioTO));
    this.negocioGuardar = JSON.parse(JSON.stringify(this.negocioGuardar));    
    let all = {
      info: this.negocioTO,
      pys: this.negocioGuardar
    };
    let navigationExtras = JSON.stringify(all);
    this.router.navigate(["/tabs/home/negocio/card-negocio/info-negocio"], {
      queryParams: { special: navigationExtras },
    });
  }

  regresarMis() {
    this.negocioTO = JSON.parse(JSON.stringify(this.negocioTO));
    let navigationExtras = JSON.stringify(this.negocioTO);
    this.router.navigate(["/tabs/home/negocio/card-negocio"], {
      queryParams: { special: navigationExtras },
    });
  }
  
  datosDomicilio(negocio: NegocioModel) {
    this.datosC();
    this.negocioTO = JSON.parse(JSON.stringify(negocio));
    this.negocioGuardar = JSON.parse(JSON.stringify(this.negocioGuardar));
    let all = {
      info: this.negocioTO,
      pys: this.negocioGuardar
    };
    let navigationExtras = JSON.stringify(all);
    this.router.navigate(["/tabs/home/negocio/mis-negocios/datos-domicilio"], {
      queryParams: { special: navigationExtras },
    });
  }
  
  guardar() {
    this.datosC();
    this.negocioServico.guardar(this.negocioGuardar).subscribe(
      response => {        
        if (response.code === 200) {
          this.notificaciones.exito('Tu negocio se guardo exitosamente');
          this.router.navigate(["/tabs/home/negocio"]);
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
  datosC(){
    this.negocioGuardar.telefono = this.negocioTO.telefono;
    this.negocioGuardar.celular = this.negocioTO.celular;
    this.negocioGuardar.correo = this.negocioTO.correo;
    this.negocioGuardar.id_facebook = this.negocioTO.id_facebook;
    this.negocioGuardar.twitter = this.negocioTO.twitter;
    this.negocioGuardar.instagram = this.negocioTO.instagram;
    this.negocioGuardar.youtube = this.negocioTO.youtube;
    this.negocioGuardar.tiktok = this.negocioTO.tiktok;
  }
}
