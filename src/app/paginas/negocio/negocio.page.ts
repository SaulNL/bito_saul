import { Component, OnInit } from "@angular/core";
import { ActionSheetController, AlertController } from "@ionic/angular";
import { Router, ActivatedRoute } from "@angular/router";
import { NegocioModel } from "./../../Modelos/NegocioModel";
import { NegocioService } from "./../../api/negocio.service";

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

  constructor(
    private servicioNegocios: NegocioService,
    private actionSheetController: ActionSheetController,
    private router: Router,
    private active: ActivatedRoute
  ) {
    this.listaNegocios = [];
    this.usuario = JSON.parse(localStorage.getItem("u_data"));
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
        /* ,{
        text: 'Editar',
        role: 'edit',
        handler: () => {
          //
        }
      }*/
        {
          text: "Cancel",
          icon: "close",
          role: "cancel",
          handler: () => {},
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
  datosNegocio(negocio: NegocioModel) {
    this.selectTO = JSON.parse(JSON.stringify(negocio));
    let navigationExtras = JSON.stringify(this.selectTO);
    this.router.navigate(["/tabs/home/negocio/mis-negocios"], {
      queryParams: { special: navigationExtras },
    });
  }

  agregarNegocio() {
    this.selectTO = new NegocioModel();
    let navigationExtras = JSON.stringify(this.selectTO);
    this.router.navigate(["/tabs/home/negocio/mis-negocios"], {
      queryParams: { special: navigationExtras },
    });
  }
}