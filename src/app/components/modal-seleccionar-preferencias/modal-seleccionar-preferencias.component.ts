import { Component, OnInit, Input, NgModule } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FiltrosService } from 'src/app/api/filtros.service';
import { ToadNotificacionService } from 'src/app/api/toad-notificacion.service';

@Component({
  selector: 'app-modal-seleccionar-preferencias',
  templateUrl: './modal-seleccionar-preferencias.component.html',
  styleUrls: ['./modal-seleccionar-preferencias.component.scss'],
})
export class ModalSeleccionarPreferenciasComponent implements OnInit {

  @Input() public id_giro;
  @Input() public id_persona;
  @Input() public listaPreferencias
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
  listaSubCategories: any[]=[];//<<--- TODAS LAS CATEGORIAS DEL SERVICIO
  categoriasActuales:any[]=[]//<<--- LAS CATEGORIAS DEL INPUT

  listaSubCategoriesColor : any[]=[]
  totalCategoriasSeleccionadas: number;
  constructor(
    private filtrosService:FiltrosService,
    public modalController: ModalController,
    private toadNotificacionService: ToadNotificacionService
  ) { 
  }

  ngOnInit() { 
    this.subcategorias=this.listaPreferencias
    console.log("id_giro modal: "+this.id_giro)
    console.log("Lista de prefs inicial: "+JSON.stringify(this.listaPreferencias))
    this.listaPreferencias.forEach(giro => {
      if(giro.id_giro==this.id_giro){
        this.categoriasActuales.push(giro)
      }
      
    });
    this.obtenerCategorias(this.id_giro)
    
  }

  contarCategorías(){
    this.totalCategoriasSeleccionadas = 0;
    for (let i = 0; i < this.listaSubCategories.length; i ++){
      for (let j = 0; j < this.categoriasActuales.length; j++){

        if ( this.listaSubCategories[i].id_categoria === this.categoriasActuales[j].id_categoria){
          this.totalCategoriasSeleccionadas ++;
          j = this.categoriasActuales.length;

          }
      }

    }
    console.log('total cats selec', this.totalCategoriasSeleccionadas);
  }

  obtenerCategorias(id_giro:number){
    this.filtrosService.obtenerCategoriasGiro(id_giro).subscribe(
      response => {
          this.listaSubCategories = response.data;          
      },
      error => {
      }
    );
    this.loader = true;
    setTimeout(() => {
      this.loader = false;
      this.pintarCategoria()
      this.contarCategorías()
    }, (2000));
  }

  pintarCategoria(){
    this.listaSubCategories.forEach(cat => {
      this.categoriasActuales.forEach(catFav => {
        if(cat.id_categoria == catFav.id_categoria){
          cat.active="true"        
        }
      });
      this.listaSubCategoriesColor.push(cat)
    });
  }

  cerrar() {
    this.modalController.dismiss({
      'data': this.subcategorias
    });
  }

  selectSubcategory(id_categoria:number, activo:string, index:number){
    console.log("id_cat: "+id_categoria+" activo: "+activo+" index: "+index)
    const addCatFavorita = {
      "id_giro": this.id_giro,
      "id_categoria": id_categoria,
      "id_persona_preferencia": null,
      "id_persona": this.id_persona
    }

    if(this.totalCategoriasSeleccionadas<5 || activo==="true"){
      if(activo=="true"){
        this.listaSubCategoriesColor[index].active="false"
        this.totalCategoriasSeleccionadas= this.totalCategoriasSeleccionadas-1
        let indiceBorrar = this.buscarIndex(this.subcategorias,id_categoria)
        this.subcategorias.splice(indiceBorrar, 1);
      }
      if((activo=="false" || activo==undefined) && this.totalCategoriasSeleccionadas<5){
        this.listaSubCategoriesColor[index].active="true"
        this.totalCategoriasSeleccionadas++
        this.subcategorias.push(addCatFavorita)
      }
      
         
    }else{
      console.log(this.totalCategoriasSeleccionadas)
      this.toadNotificacionService.alerta("Solo puedes agregar 5 categorias");
    }
  }

  buscarIndex(lista:any,id_categoria:number){
    var indice= null
    lista.forEach((element, index) => {
      if(element.id_categoria==id_categoria){
        indice = index
      }
    });
    return indice
  }
  limpiarCategoria(){     ///FALTA LIMPIAR CATEGORÍA
    this.listaSubCategoriesColor.forEach((cat, index) => {
      if(cat.active != undefined){
        cat.active="false"
      }
      let indiceBorrar = this.buscarIndex(this.subcategorias,cat.id_categoria)
        this.subcategorias.splice(indiceBorrar, 1);
    });    
    //this.subcategorias=this.listaSubCategoriesColor
  }

  guardarPreferencias(){
    this.modalController.dismiss({
      'data': this.subcategorias
    });
  }

}
