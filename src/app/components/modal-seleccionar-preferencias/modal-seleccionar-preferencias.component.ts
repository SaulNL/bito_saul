import { Component, OnInit, Input, NgModule } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FiltrosService } from 'src/app/api/filtros.service';

@Component({
  selector: 'app-modal-seleccionar-preferencias',
  templateUrl: './modal-seleccionar-preferencias.component.html',
  styleUrls: ['./modal-seleccionar-preferencias.component.scss'],
})
export class ModalSeleccionarPreferenciasComponent implements OnInit {

  @Input() public id_giro;
  planes:any[]
  public planSeleccionado: any;
  public loader: boolean;
  public cordenada: number;
  public msj = 'Cargando';

  slideOpts = {
    
    autoHeight: false,
    autoWidht:false,
    slidesPerView: 1,
    centeredSlides: true,
    loop: true,
    spaceBetween: 10,
  }
  //public idSuscripcion: any = '';
  public subcategorias:any[]=[];
  listaSubCategoties: any[]=[];

  constructor(
    private filtrosService:FiltrosService,
    public modalController: ModalController,
  ) { 
  }

  ngOnInit() { 
    console.log("id_giro modal: "+this.id_giro)
    this.obtenerGiros(this.id_giro)
  }

  obtenerGiros(id_giro:number){
    this.filtrosService.obtenerCategoriasGiro(id_giro).subscribe(
      response => {
          this.listaSubCategoties = response.data;
          console.log(JSON.stringify(this.listaSubCategoties))
          
      },
      error => {
      }
    );
    this.loader = true;
    setTimeout(() => {
      this.loader = false;
    }, (2000));
  }


  cerrar() {
    this.modalController.dismiss();
  }

  selectSubcategory(id_categoria:number){
    this.subcategorias.push(id_categoria)
    console.log(this.subcategorias)
  }
  seleccionarSucripcion(){    
    
    console.log("Usted seleccionó estas subcategorias: "+this.subcategorias)
    this.modalController.dismiss({
      'data': this.subcategorias
    });
  }

}
