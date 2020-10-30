import { Component, OnInit, Input} from '@angular/core';
import { FiltroCatSubCategoriasModel } from './../../../../Modelos/catalogos/FiltroCatSubcategoriasModel';
import { AdministracionService } from '../../../../api/administracion-service.service';
import { LoadingController } from '@ionic/angular';
import { ToadNotificacionService } from './../../../../api/toad-notificacion.service';
import { Router, ActivatedRoute } from '@angular/router';




@Component({
  selector: 'app-cat-subcategoria',
  templateUrl: './cat-subcategoria.page.html',
  styleUrls: ['./cat-subcategoria.page.scss'],
})
export class CatSubcategoriaPage implements OnInit {
  public subcategoriaTO: FiltroCatSubCategoriasModel;
  public lstCatSubcategoria: Array<any>;
  public loader: any;
  public blnActivaDatosSubcategoria: boolean;
  public all: any;
  selectTO: FiltroCatSubCategoriasModel;
  constructor(
    private servicioUsuarios: AdministracionService,
    public loadingController: LoadingController,
    private notificaciones: ToadNotificacionService,
    private active: ActivatedRoute,
    private router: Router
  ) { 
    this.blnActivaDatosSubcategoria = false;
  }

  ngOnInit() {
   
   
   this.active.queryParams.subscribe(params => {
    if (params && params.subcat) {
      this.subcategoriaTO  = JSON.parse(params.subcat);
      this.listaSubcategoria(this.subcategoriaTO.id_giro);
    }
  });

   this.active.queryParams.subscribe(params => {
    if (params && params.back) {
      if (params.back){
        //this.listaSubcategoria(this.subcategoriaTO.id_giro);
      }
    }
  });
  }
  async presentLoading() {
    this.loader = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'por favor espera...'
    });
    return this.loader.present();
  }
  listaSubcategoria(id_giro) {
    //this.presentLoading();
    
    this.servicioUsuarios.listaSubcategoriaCategoria(id_giro).subscribe(
      response => {
      //this.loader.dismiss();
      this.lstCatSubcategoria = response.data;
      },
      error => {
        this.notificaciones.error(error);
      }
    );
  }
  
    cerraCatSubcategoria(){ 
      let navigationExtras = JSON.stringify(this.subcategoriaTO);
    this.router.navigate(['/tabs/home/cat-categoria/datos-categoria'], { queryParams: {special: navigationExtras}  });
      //this.admin.blnActivoSubcategorias = false;
      //this.admin.blnActivoCategoria = true;
  }
  datosSubcategoria(subcategoria: FiltroCatSubCategoriasModel) {
    this.selectTO = JSON.parse(JSON.stringify(subcategoria));
    this.all = {
      make: this.selectTO,
      model: this.subcategoriaTO
  };
    let navigationExtras = JSON.stringify(this.all);
    this.router.navigate(['/tabs/home/cat-categoria/datos-categoria/cat-subcategoria/datos-subcategoria'], { queryParams: {special: navigationExtras}  });
  }
  agregarSubcategoria() {
    this.selectTO = new FiltroCatSubCategoriasModel();
    let navigationExtras = JSON.stringify(this.selectTO);
    this.router.navigate(['/tabs/home/cat-categoria/datos-categoria/cat-subcategoria/datos-subcategoria'], { queryParams: {special: navigationExtras}  });
  }
}
