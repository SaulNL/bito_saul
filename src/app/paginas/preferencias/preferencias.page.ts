import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { FiltrosService } from 'src/app/api/filtros.service';
import { ToadNotificacionService } from 'src/app/api/toad-notificacion.service';
import { ModalController } from '@ionic/angular';
import { ModalSeleccionarPreferenciasComponent } from 'src/app/components/modal-seleccionar-preferencias/modal-seleccionar-preferencias.component';

@Component({
  selector: 'app-preferencias',
  templateUrl: './preferencias.page.html',
  styleUrls: ['./preferencias.page.scss'],
})
export class PreferenciasPage implements OnInit {
  public cordenada: number;
  @ViewChild(IonContent) content: IonContent;

  public loader: boolean;
  public msj = 'Cargando';
  listaGiros: any;
  girosFav: any[] =[]
  subCatSelect: any;
  constructor(private filtrosService:FiltrosService,
    public modalController: ModalController,
    private toadNotificacionService: ToadNotificacionService,) { }

  ngOnInit() {
    this.obtenerGiros()
  }

  obtenerGiros(){
    this.filtrosService.obtenerGiros().subscribe(
      response => {
          this.listaGiros = response.data;
          console.log(JSON.stringify(this.listaGiros))
          
      },
      error => {
      }
    );
    this.loader = true;
    setTimeout(() => {
      this.loader = false;
    }, (2000));
  }

  async modalPrefByGiro(event) {   
     this.subCatSelect= await this.modalSeleccionarSubcategorias(event)
     console.log("subcats elegdas= "+JSON.stringify(this.subCatSelect))
    if(this.girosFav.length<5){
      this.girosFav.push(event)   
      console.log("tamaño favs: "+this.girosFav.length)   
    }else{
      this.toadNotificacionService.alerta("Solo puedes agregar 5 categorias");
    }
    
  }
  public seleccionado(id_giro:any){
    this.girosFav.forEach(id => {
      if(id==id_giro){  
        console.log("se agrega este id: "+id_giro)    
        return id
      }else{
        console.log("No esta") 
        return null
      }
    });
  }

  async modalSeleccionarSubcategorias(id_giro: number) {
    const modal = await this.modalController.create({
      component: ModalSeleccionarPreferenciasComponent,
      cssClass: 'my-custom-class',
      componentProps: {
        id_giro: id_giro
      }
    });
    await modal.present();
    var data = await modal.onDidDismiss().then(r => {
      if (r !== undefined) {
        return r;
      }else{
        return null;
      }
    }
    );
    return data;
  }

}
