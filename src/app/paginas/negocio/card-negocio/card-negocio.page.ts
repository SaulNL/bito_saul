import { FormularioNegocioGuard } from './../../../api/formulario-negocio-guard.service';
import { Component, OnInit } from "@angular/core";
import { NegocioModel } from "./../../../Modelos/NegocioModel";
import { Router, ActivatedRoute } from "@angular/router";
import { NegocioService } from "../../../api/negocio.service";
import { ToadNotificacionService } from "./../../../api/toad-notificacion.service";
import { AlertController } from "@ionic/angular";
import {SolicitarValidacionModel} from '../../../Modelos/SolicitarValidacionModel';

@Component({
  selector: "app-card-negocio",
  templateUrl: "./card-negocio.page.html",
  styleUrls: ["./card-negocio.page.scss"],
})
export class CardNegocioPage implements OnInit {
  public negocioTO: NegocioModel;
  public negocioGuardar: any;
  public btload: boolean;
  public listTipoNegocio: any;
  public proervi: any;
  public solicitudValidar: SolicitarValidacionModel;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private negocioServico: NegocioService,
    private notification: ToadNotificacionService,
    public alertController: AlertController,
    private guard: FormularioNegocioGuard
  ) {
    this.negocioGuardar = new NegocioModel();
    this.btload = false;
    this.guard.activeForm = false;
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params) => {
      if (params && params.special) {
        this.negocioTO = JSON.parse(params.special);
        if (this.negocioTO.id_negocio === null) {
          this.router.navigate(["/tabs/home/negocio"]);
        } else {
          this.buscarNegocio();

        }
      } else {
        this.router.navigate(["/tabs/home/negocio"]);
        this.notification.error("Reintentar");
      }
    });
  }

  public buscarNegocio() {
    this.btload = false;
    this.negocioServico.buscarNegocio(this.negocioTO.id_negocio).subscribe(
      (response) => {
        this.negocioTO = response.data;
        this.btload = true;
        //console.log("fun buscarNegocio: ", JSON.stringify(this.negocioTO))
      },
      (error) => {

      }
    );
  }


  inforNegocio() {
    const negocio = this.negocioTO;
    //console.log("card Negocio negocio---------"+JSON.stringify(negocio))
    this.guard.activeForm = true;
    this.negocioTO = JSON.parse(JSON.stringify(negocio));
    this.negocioGuardar = JSON.parse(JSON.stringify(this.negocioGuardar));
    let all = {
      info: this.negocioTO,
      pys: this.negocioGuardar,
    };
    let navigationExtras = JSON.stringify(all);
    //console.log("card Negocio navigationExtras inforNegocio---------"+navigationExtras)
    this.router.navigate(['/tabs/home/negocio/card-negocio/formulario-negocio'], {
      queryParams: { special: navigationExtras }
    });
  }

  /*crearSucursal() {
    const negocio = this.negocioTO;    
    this.guard.activeForm = true;    
    
    console.log("card Negocio crearSucursal---------"+JSON.stringify(negocio))
    this.negocioTO = JSON.parse(JSON.stringify(negocio));
    this.negocioGuardar = JSON.parse(JSON.stringify(this.negocioGuardar));
    let all = {
      info: this.negocioTO,
      pys: this.negocioGuardar, 
    };
    let navigationExtras = JSON.stringify(all);
    console.log("card Negocio all---------"+navigationExtras)
    let clonar = "true"
    console.log("card Negocio navigationExtras crearSucursal---------"+navigationExtras)
    this.router.navigate(['/tabs/home/negocio/card-negocio/formulario-negocio'], {
      queryParams: { special: navigationExtras, clonar: clonar }
    });
  }
*/
  regresar() {
    this.router.navigate(["/tabs/home/negocio"], {
      queryParams: { special: true },
    });
  }
  productosServicios(negocio: NegocioModel, inde) {
    this.negocioTO = JSON.parse(JSON.stringify(negocio));
    let all = {
      inden: inde,
      info: this.negocioTO,
    };
    let navigationExtras = JSON.stringify(all);
    this.router.navigate(
      ["/tabs/home/negocio/card-negocio/mis-productos-servicios"],
      {
        queryParams: { special: navigationExtras },
      }
    );
  }
  async presentAlertADesactivar() {
    const alert = await this.alertController.create({
      cssClass: "my-custom-class",
      header: "¿Está seguro de desactivar este negocio?",
      message:
        "Al desactivar este negocio, no se visalizará en las busquedas, y nadie podrá ver la infomación del mismo",
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          cssClass: "secondary",
          handler: (blah) => {},
        },
        {
          role: "destructive",
          text: "Confirmar",
          handler: () => {
            this.desactivarConfirmado();
          },
        },
      ],
    });
    await alert.present();
  }
  desactivarConfirmado() {
    this.negocioServico
      .activarDesactivar(this.negocioTO.id_negocio, false)
      .subscribe(
        (repuesta) => {
          if (repuesta.data) {
            this.notification.exito(
              "Se actualizó el estatus del negocio con éxito"
            );
            this.router.navigate(["/tabs/home/negocio"]);
          } else {
            this.notification.error(
              "Ocurrio un error al actualizar el estatus del negocio"
            );
          }
        },
        (error) => {
          this.notification.error(
            "Ocurrio un error al actualizar el estatus del negocio"
          );
        }
      );
  }

  activarConfirmado() {
    this.negocioServico
      .activarDesactivar(this.negocioTO.id_negocio, true)
      .subscribe(
        (repuesta) => {
          if (repuesta.data) {
            this.notification.exito(
              "Se actualizó el estatus del negocio con éxito"
            );
            this.router.navigate(["/tabs/home/negocio"]);
          } else {
            this.notification.error(
              "Ocurrio un error al actualizar el estatus del negocio"
            );
          }
        },
        (error) => {
          this.notification.error(
            "Ocurrio un error al actualizar el estatus del negocio"
          );
        }
      );
  }

  solicitarValidacion(){
    console.log(".negocioTO.id_negocio validacion : "+this.negocioTO.id_negocio)
    var body={ id_negocio: this.negocioTO.id_negocio }
    this.negocioServico.solicitarValidacionNegocio(JSON.stringify(body)).subscribe(
        response => {
          console.log("response validacion"+JSON.stringify(response))
          if (response.code === 200) {
            if (response.data.code === 200){
              this.notification.exito('Tu negocio será revisado por un administrador de Bitoo. Recibirás una notificación para conocer el estatus de tu solicitud');
            }else{
              this.notification.alerta('La solicitud no pudo ser procesada');
            }
          }else{
            this.notification.alerta('La solicitud no pudo ser procesada');
          }

        },
        error => {
          this.notification.error(error.message);
        });

  }
}
