import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { FiltrosService } from 'src/app/api/filtros.service';
import { ToadNotificacionService } from 'src/app/api/toad-notificacion.service';
import { ModalController } from '@ionic/angular';
import { ModalSeleccionarPreferenciasComponent } from 'src/app/components/modal-seleccionar-preferencias/modal-seleccionar-preferencias.component';
import { UtilsCls } from 'src/app/utils/UtilsCls';
import {Router} from '@angular/router';
@Component({
  selector: 'app-preferencias',
  templateUrl: './preferencias.page.html',
  styleUrls: ['./preferencias.page.scss'],
})
export class PreferenciasPage implements OnInit {
  //public cordenada: number;
  //@ViewChild(IonContent) content: IonContent;

  public user: any;
  public loader: boolean;
  public msj = 'Cargando';
  listaGirosColor : any[]=[]
  listaGiros: any[]=[];
  regresarValor: any;
  listaPreferencias: any;
  listaNueva: any;
  subCatSelect: any;
  totalGirosSeleccionados: number;
  banderaSub25: boolean;
  constructor(
      private filtrosService:FiltrosService,
      private util: UtilsCls,
      public modalController: ModalController,
      private toadNotificacionService: ToadNotificacionService,
      private router: Router,
  ) {
    this.user = this.util.getUserData();
    this.listaNueva = [];
  }

  ngOnInit() {
    this.loader = true;
    this.obtenerPreferencias(this.user.id_persona);
  }

  async obtenerPreferencias(id_persona){
    this.filtrosService.obtenerPreferencias(id_persona).subscribe(
      async response => {
          this.listaPreferencias = response.data.preferencias;
          //console.log("listaPreferencias:  \n"+JSON.stringify(await this.listaPreferencias))
          this.obtenerGiros();
          this.contarTotal();
      },
      error => {
      }
    );
    
  }

  contarGiros(){
    this.totalGirosSeleccionados = 0;
    for (let i = 0; i < this.listaGiros.length; i ++){
      for (let j = 0; j < this.listaPreferencias.length; j++){

        if ( this.listaGiros[i].id_giro === this.listaPreferencias[j].id_giro){
          this.totalGirosSeleccionados ++;
          j = this.listaPreferencias.length;
          }
      }

    }
  }
  
  obtenerGiros(){    
    this.filtrosService.obtenerGiros().subscribe(
      response => {
        if(response.code==200){
          this.listaGiros= response.data;
          setTimeout(() => {
            this.pintarGiro();
            this.contarGiros();
          }, (500));
        }else{
          this.toadNotificacionService.error("Algo sucedió, intentalo mas tarde");
        }        
      },
      error => {
      }
    );

  }

  pintarGiro(){
    this.listaGiros.forEach(giro => {
      giro.active = "false"
      this.listaPreferencias.forEach(giroFav => {
        if(giro.id_giro == giroFav.id_giro){
          giro.active="true"        
        }
      });
      this.listaGirosColor.push(giro)
    });
    this.loader = false;
  }
  async modalPrefByGiro(giro:number, activo:string, index:number) { 
    if(this.totalGirosSeleccionados<5 || activo === "true"){   
      console.log("giro: "+giro+" activo: "+activo)            
      if(activo == "false"){
        this.totalGirosSeleccionados++
        this.listaGirosColor[index].active="true"

      }
      if(activo == "true"){
        //console.log("giro: "+giro+" activo: "+activo)
        //this.totalGirosSeleccionados=this.totalGirosSeleccionados-1
      }
      
      this.subCatSelect= await this.modalSeleccionarSubcategorias(giro,this.user.id_persona,this.listaPreferencias)
      //console.log("subcats elegdas= \n"+JSON.stringify(this.subCatSelect.data.data))
      var agregoAlguno=false
      this.subCatSelect.data.data.forEach(subcat => {
        if(subcat.id_giro==giro){
          agregoAlguno = true
        }
      });
      if(agregoAlguno==false){
        this.listaGirosColor[index].active="false"
        this.totalGirosSeleccionados=this.totalGirosSeleccionados-1
      }
      this.listaPreferencias = this.subCatSelect.data.data;
    }else{
      this.toadNotificacionService.alerta("Solo puedes agregar 5 categorias");
    }
    
  }


  async modalSeleccionarSubcategorias(id_giro: number,id_persona, listaPreferencias:any[]) {
    const modal = await this.modalController.create({
      component: ModalSeleccionarPreferenciasComponent,
      cssClass: 'my-custom-class',
      componentProps: {
        id_giro: id_giro,
        id_persona: id_persona,
        listaPreferencias: listaPreferencias
      }
    });
    await modal.present();
    var data = await modal.onDidDismiss().then(r => {
      if (r !== undefined) {
        this.regresarValor =r;
        this.contarRegreso(this.regresarValor);
        return r;
      }else{
        return null;
      }
    }
    );
    return data;
  }

  guardarPreferencias(){
    var payload = {
      id_persona: this.user.id_persona,
      preferencias: this.listaPreferencias
    }
    //console.log("guardar preferencias payload:\n"+JSON.stringify(payload))

    this.loader = true;
    this.msj="Guardando sus preferencias, espere un momento"

    setTimeout(() => {
      location.reload();
    }, 300);

    this.filtrosService.guardarMisPreferencias(payload).subscribe(
      async response => {   
        if(response.code==200){
          if(response.data==true){
            this.toadNotificacionService.success(response.message);
          }else{
            this.toadNotificacionService.error(response.message);
          }
        }else{
          this.toadNotificacionService.error(response.message);
        }    
          //console.log("response guardar preferencias:  \n"+JSON.stringify(await response))
          this.loader = false;           
        },
      error => {
      }
    );
  }

  contarTotal(){
    if ( this.listaPreferencias.length === 25) {
      this.banderaSub25 = false;
    }else{
      this.banderaSub25 = true;
    }
  }

  contarRegreso(regreso){
    const r = regreso.data.data;
    if ( r.length === 25) {
      this.banderaSub25 = true;
    }else if (r.length < 25){
      this.banderaSub25 = true;
    }else{
      this.banderaSub25 = false;
    }
  }

  regresar() {
    this.router.navigate(['/tabs/home']);
  }

}
