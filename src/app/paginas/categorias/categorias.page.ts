import { Component, OnInit } from '@angular/core';
import { BusquedaService } from '../../api/busqueda.service';
import {Router, ActivatedRoute} from '@angular/router';
import { FiltrosModel } from '../../Modelos/FiltrosModel';
@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.page.html',
  styleUrls: ['./categorias.page.scss'],
})
export class CategoriasPage implements OnInit {

  public listaCategorias: Array<any>;
  private Filtros: FiltrosModel;
  constructor(
    private busquedaService:BusquedaService,
    private router:Router
    ) { 
      this.Filtros = new FiltrosModel();
      this.Filtros.idEstado = 29;
    }

  ngOnInit() {
    this.obtenerCategorias();
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
