import { DatosCategoriaPage } from './../cat-categoria/datos-categoria/datos-categoria.page';
import { Component, OnInit, Input} from '@angular/core';
import { FiltroCatSubCategoriasModel } from './../../../../Modelos/catalogos/FiltroCatSubcategoriasModel';
import { AdministracionService } from '../../../../api/administracion-service.service';
import { LoadingController } from '@ionic/angular';
import { ToadNotificacionService } from './../../../../api/toad-notificacion.service';





@Component({
  selector: 'app-cat-subcategoria',
  templateUrl: './cat-subcategoria.page.html',
  styleUrls: ['./cat-subcategoria.page.scss'],
})
export class CatSubcategoriaPage implements OnInit {
  @Input() public subcategoriaTO: FiltroCatSubCategoriasModel;
  public lstCatSubcategoria: Array<any>;
  public loader: any;
  public blnActivaDatosSubcategoria: boolean;
  selectTO: FiltroCatSubCategoriasModel;
  constructor(
    private servicioUsuarios: AdministracionService,
    public loadingController: LoadingController,
    private notificaciones: ToadNotificacionService,
    public admin: DatosCategoriaPage
  ) { 
    this.blnActivaDatosSubcategoria = false;
  }

  ngOnInit() {
   this.listaSubcategoria();
  }
  async presentLoading() {
    this.loader = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'por favor espera...'
    });
    return this.loader.present();
  }
  listaSubcategoria() {
    this.presentLoading();
    this.servicioUsuarios.listaSubcategoriaCategoria(this.subcategoriaTO.id_giro).subscribe(
      response => {
      this.loader.dismiss();
      this.lstCatSubcategoria = response.data;
      },
      error => {
        this.notificaciones.error(error);
      }
    );
  }
    cerraCatSubcategoria(){ 
      this.admin.blnActivoSubcategorias = false;
      this.admin.blnActivoCategoria = true;
  }
  datosSubcategoria(subcategoria: FiltroCatSubCategoriasModel) {
    this.selectTO = JSON.parse(JSON.stringify(subcategoria));
    this.blnActivaDatosSubcategoria = true;
  }
  agregarSubcategoria() {
    this.selectTO = new FiltroCatSubCategoriasModel();
    this.blnActivaDatosSubcategoria = true;
  }
}
