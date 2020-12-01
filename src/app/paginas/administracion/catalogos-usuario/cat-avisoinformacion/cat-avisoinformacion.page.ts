import { Component, OnInit } from '@angular/core';
import { FiltroCatAvisosInfoModel } from '../../../../Modelos/catalogos/FiltroCatAvisosInfoModel';
import { AdministracionService } from "../../../../api/administracion-service.service";
import { ActionSheetController, AlertController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-cat-avisoinformacion',
  templateUrl: './cat-avisoinformacion.page.html',
  styleUrls: ['./cat-avisoinformacion.page.scss'],
})
export class CatAvisoinformacionPage implements OnInit {
  selectTO: FiltroCatAvisosInfoModel;
  public lstCatAvisos: Array<FiltroCatAvisosInfoModel>;
  public blnActivaDatosAvisos: boolean;
  public blnActivaDatosPopover: boolean;
  public filtro: FiltroCatAvisosInfoModel;
  public isToggled:boolean;
  public blnMensajeFiltro: boolean;
  public blnBtnFiltro: boolean;

  constructor(
    private _administradorService: AdministracionService,
    private actionSheetController: ActionSheetController,
    public alertController: AlertController,
    private router: Router,
    private active: ActivatedRoute
  ) {
    this.lstCatAvisos = [];
    this.blnActivaDatosAvisos = false;
    this.blnActivaDatosPopover = false;
    this.isToggled=false;
    this.blnMensajeFiltro = false;
   }

  ngOnInit() {
    this.getAvisos();
    this.active.queryParams.subscribe(params => {
      if (params && params.special) {
        if (params.special){
          this.getAvisos();
        }
      }
    });
  }

  public notify() {
    if (this.isToggled) {
      this.isToggled = false;
      this.getAvisos();
    } else {
      this.isToggled = true;
    }
    this.filtro = new FiltroCatAvisosInfoModel();
  }

  getAvisos() {
    //this.loaderGiro = true;
    this._administradorService.listarAviso().subscribe(
      response => {
        this.lstCatAvisos = response.data;
        //this.loaderGiro = false;
      },
      error => {
        //this._notificacionService.pushError(error);
      }
    );
  }

  datosAviso(aviso: FiltroCatAvisosInfoModel) {
    if (aviso.tipo_aviso === 1) {
      //console.log('1');
      //console.log(aviso.tipo_aviso);
      this.selectTO = JSON.parse(JSON.stringify(aviso));
      let navigationExtras = JSON.stringify(this.selectTO);
  this.router.navigate(['/tabs/home/cat-avisos/datos-avisos-informacion'], { queryParams: {special: navigationExtras}  });
      //window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      //console.log('2');
      //console.log(aviso.tipo_aviso);
      this.selectTO = JSON.parse(JSON.stringify(aviso));
      let navigationExtras = JSON.stringify(this.selectTO);
  this.router.navigate(['/tabs/home/cat-avisos/datos-popover'], { queryParams: {special: navigationExtras}  });
      //window.scrollTo({ top: 0, behavior: 'smooth' });
    }

  }

  agregarAviso() {
    //window.scrollTo({ top: 0, behavior: 'smooth' });
    this.selectTO = new FiltroCatAvisosInfoModel();
    let navigationExtras = JSON.stringify(this.selectTO);
  this.router.navigate(['/tabs/home/cat-avisos/datos-avisos-informacion'], { queryParams: {special: navigationExtras}  });

    //this.activarTabla();
  }
  agregarPopover() {
    //window.scrollTo({ top: 0, behavior: 'smooth' });
    this.selectTO = new FiltroCatAvisosInfoModel();
    let navigationExtras = JSON.stringify(this.selectTO);
  this.router.navigate(['/tabs/home/cat-avisos/datos-popover'], { queryParams: {special: navigationExtras}  });

    //this.activarTablaPopover();
  }

  validarFiltros() {
    if ((this.filtro.nombre !== null && this.filtro.nombre !== '') ||
      (this.filtro.descripcion !== null && this.filtro.descripcion !== '')) {
      return true;
    } else {
      return false;
    }
  }

  setBlnFiltro() {
    this.blnBtnFiltro = this.validarFiltros();
  }

  public obtenerAvisos() {
    if (this.validarFiltros()) {
      //this.loadbuscar = true;
      this._administradorService.obtenerAviso(this.filtro).subscribe(
        response => {
          //this.loadbuscar = false;
          this.lstCatAvisos = response.data;
          this.blnMensajeFiltro = true;
        },
        error => {
          //this._notificacionService.pushError(error);
        }
      );
    } else {
      //this._notificacionService.pushAlert('Seleccione un parametro de búsqueda');
    }
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Agregar',
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Banner',
        role: 'destructive',
        handler: () => {
          this.agregarAviso();
        }
      },{
        text: 'Popover',
        role: 'edit',
        handler: () => {
          this.agregarPopover();
        }
      }
    ]
    });
    await actionSheet.present();
  }
  limpiarFiltro() {
    this.getAvisos();
    this.filtro = new FiltroCatAvisosInfoModel();
    this.blnBtnFiltro = this.validarFiltros();
  }
}
