import { Component, OnInit, ViewChild } from '@angular/core';
import { BusquedaService } from '../../api/busqueda.service';
import {Router} from '@angular/router';
import { FiltrosModel } from '../../Modelos/FiltrosModel';
import { HostListener } from '@angular/core';
import {IonContent, NavController, Platform} from "@ionic/angular";
import {SideBarService} from "../../api/busqueda/side-bar-service";
@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.page.html',
  styleUrls: ['./categorias.page.scss'],
  providers:[SideBarService]
})
export class CategoriasPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  public cordenada: number;

  public listaCategorias: Array<any>;
  private Filtros: FiltrosModel;
  public imgMobil:boolean;
  public isIOS: boolean = false;
  constructor(
    private busquedaService:BusquedaService,
    private sideBarService: SideBarService,
    private platform: Platform,
    private router:Router,
    ) {
      this.Filtros = new FiltrosModel();
      this.Filtros.idEstado = 29;
    this.isIOS = this.platform.is('ios');
    }

  ngOnInit() {
    if (localStorage.getItem("isRedirected") === "false" && !this.isIOS) {
      localStorage.setItem("isRedirected", "true");
      location.reload();
    }
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

    });
  }

  seleccionarCategoria(subCategoria){
    localStorage.setItem('seleccionado', JSON.stringify(subCategoria));
    localStorage.removeItem('busqueda');
    localStorage.setItem('filter', 'true');
    this.router.navigate(["/tabs/inicio"]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

}
