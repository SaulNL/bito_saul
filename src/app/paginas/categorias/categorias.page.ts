import { Component, OnInit } from '@angular/core';
import { BusquedaService } from '../../api/busqueda.service';
import {Router, ActivatedRoute} from '@angular/router';
import { FiltrosModel } from '../../Modelos/FiltrosModel';
import { HostListener } from '@angular/core';
@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.page.html',
  styleUrls: ['./categorias.page.scss'],
})
export class CategoriasPage implements OnInit {

  public listaCategorias: Array<any>;
  private Filtros: FiltrosModel;
  public imgMobil:boolean;
  constructor(
    private busquedaService:BusquedaService,
    private router:Router
    ) { 
      this.Filtros = new FiltrosModel();
      this.Filtros.idEstado = 29;
    }

  ngOnInit() {
    this.obtenerCategorias();
    if(window.innerWidth<=768){
      this.imgMobil=true;
    }else{
      this.imgMobil=false;
    }
  }

  @HostListener('window:resize', ['$event']) 
    onResize(event){
      if(window.innerWidth<=768){
        this.imgMobil=true;
      }else{
        this.imgMobil=false;
      }
    } 
  
  obtenerCategorias(){
    this.busquedaService.obtenerCategorias().subscribe(
      response=>{
        this.listaCategorias=response.data;
    },error=>{
      console.log(error);
    });
  }

  seleccionarCategoria(subCategoria){
    localStorage.setItem('seleccionado', JSON.stringify(subCategoria));
    localStorage.removeItem('busqueda');
    this.router.navigate(['/tabs/inicio']);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

}
