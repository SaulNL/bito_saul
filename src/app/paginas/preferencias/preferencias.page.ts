import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { FiltrosService } from 'src/app/api/filtros.service';
import { ToadNotificacionService } from 'src/app/api/toad-notificacion.service';
import { ModalController } from '@ionic/angular';
import { ModalSeleccionarPreferenciasComponent } from 'src/app/components/modal-seleccionar-preferencias/modal-seleccionar-preferencias.component';
import { UtilsCls } from 'src/app/utils/UtilsCls';
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
  listaPreferencias: any;
  subCatSelect: any;
  totalGirosSeleccionados: number;
  constructor(private filtrosService:FiltrosService,
    private util: UtilsCls,
    public modalController: ModalController,
    private toadNotificacionService: ToadNotificacionService,) { this.user = this.util.getUserData();}

  ngOnInit() {
    
    this.obtenerPreferencias(this.user.id_persona);
  }

  async obtenerPreferencias(id_persona){
    this.filtrosService.obtenerPreferencias(id_persona).subscribe(
      async response => {
          this.listaPreferencias = response.data.preferencias;
          console.log("listaPreferencias:  \n"+JSON.stringify(await this.listaPreferencias))
          this.obtenerGiros()   
           
        },
      error => {
      }
    );
    this.loader = true;
    setTimeout(() => {
      this.loader = false;
      this.contarGiros()
    }, (2000));
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
    console.log('total final 1', this.totalGirosSeleccionados);
  }
  
  obtenerGiros(){
    this.filtrosService.obtenerGiros().subscribe(
      response => {
        this.listaGiros= response.data;
      },
      error => {
      }
    );
    this.loader = true;
    setTimeout(() => {
      this.loader = false;
      this.pintarGiro();
    }, (2000));
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
  }
  async modalPrefByGiro(giro:number, activo:string, index:number) { 
    if(this.totalGirosSeleccionados<5 || activo === "true"){               
      if(activo == "false"){
        this.totalGirosSeleccionados++
        this.listaGirosColor[index].active="true"
        console.log("giro: "+giro+" activo: "+activo+" totalGirosSeleccionados ="+this.totalGirosSeleccionados)
      }
      if(activo == "true"){
        console.log("giro: "+giro+" activo: "+activo+" totalGirosSeleccionados ="+this.totalGirosSeleccionados)
        //this.totalGirosSeleccionados=this.totalGirosSeleccionados-1
      }
      
      this.subCatSelect= await this.modalSeleccionarSubcategorias(giro,this.user.id_persona,this.listaPreferencias)
      console.log("subcats elegdas= \n"+JSON.stringify(this.subCatSelect.data.data))
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
      this.listaPreferencias = this.subCatSelect.data.data

      
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
    console.log("guardar preferencias payload:\n"+JSON.stringify(payload))
    this.loader = true;
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
          console.log("response guardar preferencias:  \n"+JSON.stringify(await response))
          this.loader = false;           
        },
      error => {
      }
    );
  }

}
