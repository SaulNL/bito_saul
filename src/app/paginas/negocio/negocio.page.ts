import { Component, OnInit } from "@angular/core";
import { ActionSheetController, AlertController } from "@ionic/angular";
import { Router, ActivatedRoute } from "@angular/router";
import { NegocioModel } from "./../../Modelos/NegocioModel";
import { NegocioService } from "./../../api/negocio.service";
import { ModalController } from "@ionic/angular";
import { ToadNotificacionService } from "../../api/toad-notificacion.service";
import { DetDomicilioModel } from './../../Modelos/busqueda/DetDomicilioModel';
import { FormularioNegocioGuard } from './../../api/formulario-negocio-guard.service';
@Component({
  selector: "app-negocio",
  templateUrl: "./negocio.page.html",
  styleUrls: ["./negocio.page.scss"],
})
export class NegocioPage implements OnInit {
  public listaNegocios: Array<NegocioModel>;
  public usuario: any;
  public selectTO: NegocioModel;
  loader: boolean;
  ruta: any;
  public rutaArray: string[];
  public qrdata: string = null;
  public elementType: "img" | "url" | "canvas" | "svg" = null;
  public level: "L" | "M" | "Q" | "H";
  public scale: number;
  public width: number;
  public colorLight: any;
  public colorDark: any;
  public msj = 'Cargando';

  public negocioGuardar: any;
  public btload: boolean;
  public negocioTO: NegocioModel;

  constructor(
    private servicioNegocios: NegocioService,
    private actionSheetController: ActionSheetController,
    private router: Router,
    private active: ActivatedRoute,
    private modal: ModalController,
    private notifi: ToadNotificacionService,
    private guard: FormularioNegocioGuard
  ) {
    this.listaNegocios = [];
    this.usuario = JSON.parse(localStorage.getItem("u_data"));

    this.negocioGuardar = new NegocioModel();
    this.btload = false;
    this.guard.activeForm = false;
  }

  ngOnInit() {
    this.buscarLista();
    this.active.queryParams.subscribe((params) => {
      if (params && params.special) {
        if (params.special) {
          this.buscarLista();
        }
      }
    });
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: "Opciones",
      cssClass: "my-custom-class",
      buttons: [
        {
          text: "Agregar",
          role: "add",
          handler: () => {
            this.agregarNegocio();
          },
        },
        {
          text: "Cancel",
          icon: "close",
          role: "cancel",
          handler: () => { },
        },
      ],
    });
    await actionSheet.present();
  }
  
  public buscarLista() {
    this.loader = true;
    if (this.usuario.proveedor != null) {
      this.servicioNegocios
        .misNegocios(this.usuario.proveedor.id_proveedor)
        .subscribe(
          (resp) => {
            this.listaNegocios = resp.data;
            this.loader = false;
          },
          (error) => {
            this.loader = false;
          },
          () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
        );
    } else {
      this.loader = false;
    }
  }

  viewQr(negocio: NegocioModel) {
    this.selectTO = JSON.parse(JSON.stringify(negocio));
    if (this.selectTO.url_negocio == null || this.selectTO.url_negocio == undefined) {
      this.notifi.error("Url de negocio no configurada");
    } else {
      let navigationExtras = JSON.stringify(this.selectTO);
      this.router.navigate(["/tabs/home/negocio/view-qr"], {
        queryParams: { special: navigationExtras },
      });
    }
  }

  datosNegocio(negocio: NegocioModel) {
    this.selectTO = JSON.parse(JSON.stringify(negocio));
    let navigationExtras = JSON.stringify(this.selectTO);
    this.router.navigate(["/tabs/home/negocio/card-negocio"], {
      queryParams: { special: navigationExtras },
    });
  }

  agregarNegocio() {
    this.selectTO = new NegocioModel();
    this.selectTO.det_domicilio = new DetDomicilioModel();
    let navigationExtras = JSON.stringify(this.selectTO);
    console.log("agregarNegocio NegoPage+++++++++++++++++++ "+JSON.stringify(this.selectTO))
    this.router.navigate(['/tabs/home/negocio/card-negocio/formulario-negocio'], {
      queryParams: { nuevoNegocio: navigationExtras },
    });
  }
  agregarSucursal(nego: NegocioModel) {
    this.selectTO = JSON.parse(JSON.stringify(nego));
    let extras = JSON.stringify(this.selectTO);
    let aux = JSON.parse(extras);
    this.buscarNeg(aux.id_negocio)        
  }
  public buscarNeg(id_nego:any) {
    this.servicioNegocios.buscarNegocio(id_nego).subscribe(
      (response) => {
        this.negocioTO = response.data;
        this.btload = true;
        console.log("negocioTO=", this.negocioTO)

        //const negocio = JSON.parse(this.negocioTO);    
        this.guard.activeForm = true;

        console.log("card Negocio crearSucursal---------"+JSON.stringify(this.negocioTO))
        this.negocioTO = JSON.parse(JSON.stringify(this.negocioTO));
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
      },
      (error) => {

      }
    );
  }

  public buscarNegocio(idNegocio:any, negocio : NegocioModel) {
    let newNegocioTO:NegocioModel
    this.btload = false;
    this.servicioNegocios.buscarNegocio(idNegocio).subscribe(
      (response) => {
        newNegocioTO= response.data;
        console.log("buscarNegocio---------"+JSON.stringify(newNegocioTO))
        /*this.negocioTO = response.data;
        console.log("buscarNegocio this.negocioTO---------"+JSON.stringify(this.negocioTO))*/
        this.btload = true;

        this.selectTO = JSON.parse(JSON.stringify(negocio));
        let navigationExtras = JSON.stringify(this.selectTO);
        this.negocioTO = JSON.parse(navigationExtras);
        this.negocioTO=this.buscarNegocio(this.negocioTO.id_negocio, negocio)
        //this.negocioTO=this.buscarNegocio(this.negocioTO.id_negocio)
        console.log("Negocio page negocioTO de buscarNegocio---------"+this.negocioTO)
        this.negocioGuardar = JSON.parse(JSON.stringify(this.negocioGuardar));
        let all = {
        info: this.negocioTO,
        pys: this.negocioGuardar,
        };
        let navigationExtras2 = JSON.stringify(all);
        console.log("card Negocio navigationExtras2---------"+navigationExtras2)
        this.router.navigate(['/tabs/home/negocio/card-negocio/formulario-negocio'], {
          queryParams: { special: navigationExtras2 }  
        });               
        
      },
      (error) => {

      }
    );
    return newNegocioTO
  }

  public recargar(event: any) {
    if (event.active) {
      this.buscarLista();
    }
  }
}
