import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NegocioModel } from "./../../../../Modelos/NegocioModel";
import { ActionSheetController } from "@ionic/angular";
import {NegocioService} from "../../../../api/negocio.service";
import {DetDomicilioModel} from "../../../../Modelos/DetDomicilioModel";

@Component({
  selector: 'app-informacion-negocio',
  templateUrl: './informacion-negocio.page.html',
  styleUrls: ['./informacion-negocio.page.scss'],
})
export class InformacionNegocioPage implements OnInit {
  public negocioTO: NegocioModel;
  public valido: boolean;
  
  
  public variaf: boolean;
  public variat: boolean;
  public variay: boolean;
  public variai: boolean;
  public variak: boolean;
  public listTipoNegocio: any;
  public loaderGiro: boolean;
  public listCategorias: any;
  public loaderCategoria: boolean;
  private listaSubCategorias: any;
  constructor(private router: Router,
    private negocioServico: NegocioService,
    private active: ActivatedRoute,
    private actionSheetController: ActionSheetController) {
      this.valido=false;
    this.variaf = false;
    this.variat = false;
    this.variay = false;
    this.variai = false;
    this.variak = false;

    this.listCategorias = [];
    this.listTipoNegocio = [];

     }

  ngOnInit() {
    this.active.queryParams.subscribe(params => {
      if (params && params.special) {
        this.negocioTO  = JSON.parse(params.special);
        this.negocioTO.det_domicilio =  new DetDomicilioModel()
      }
    });

    this.buscarNegocio(this.negocioTO.id_negocio)

    this.obtenerTipoNegocio();
  }
  notifyf() {
    if (this.variaf === undefined) {
      this.variaf = false;
    }
  }
  notifyy() {
    if (this.variay === undefined) {
      this.variay = false;
    }
  }
  notifyt() {
    if (this.variat === undefined) {
      this.variat = false;
    }
  }
  notifyk() {
    if (this.variak === undefined) {
      this.variak = false;
    }
  }
  notifyi() {
    if (this.variai === undefined) {
      this.variai = false;
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
            this.valido=true;
          }
        },
        {
          text: "Cancelar",
          icon: "close",
          handler: () => {
            this.valido=false;  
          }
        },
      ],
    });
    await actionSheet.present();
  }

  regresar() {
    let navigationExtras = JSON.stringify(this.negocioTO);
    this.router.navigate(["/tabs/home/negocio/mis-negocios"], {
      queryParams: { special: navigationExtras },
    });
  }
  
  datosContacto(negocio: NegocioModel) {
    this.negocioTO = JSON.parse(JSON.stringify(negocio));
    let navigationExtras = JSON.stringify(this.negocioTO);
    this.router.navigate(["/tabs/home/negocio/mis-negocios/datos-contacto"], {
      queryParams: { special: navigationExtras },
    });
  }
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  public buscarNegocio(id) {
    this.negocioServico.buscarNegocio(id).subscribe(
        response => {
          this.negocioTO = response.data;
          this.categoriaPrincipal();
          this.subcategorias();
        },
        error => {
          console.log(error);
        }
    );
  }
  public obtenerTipoNegocio() {
    this.negocioServico.obtnerTipoNegocio().subscribe(
        response => {
          this.listTipoNegocio = response.data;
        },
        error => {
          this.listTipoNegocio = [];
          console.log(error);
        }
    );
  }

  categoriaPrincipal() {
    this.loaderGiro =  true;
    this.negocioTO.id_giro =  null;
    this.listCategorias = [];
    this.negocioServico.categoriaPrincipal(this.negocioTO.id_tipo_negocio).subscribe(
        respuesta => {
          this.listCategorias = respuesta.data;
        },
        error => {
        },
        () => {
          this.loaderGiro = false;
        }
    );
  }
  subcategorias() {
    this.loaderGiro =  true;
    this.listCategorias = [];
    console.log(this.negocioTO, 'sadsadasd')
    this.negocioServico.obtenerCategorias(this.negocioTO.id_giro).subscribe(
        respuesta => {
          this.listaSubCategorias = Array();
          if (respuesta.code === 200) {
            this.listaSubCategorias = respuesta.data;
          }
        },
        error => {
        },
        () => {
          this.loaderCategoria = false;
        }
    );
  }
}
