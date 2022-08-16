import { Component, OnInit, ViewChild } from "@angular/core";
import { BusquedaService } from "../../api/busqueda.service";
import { Router } from "@angular/router";
import { FiltrosModel } from "../../Modelos/FiltrosModel";
import { HostListener } from "@angular/core";
import { IonContent, NavController, Platform } from "@ionic/angular";
import { SideBarService } from "../../api/busqueda/side-bar-service";
import { LOCAL_STORAGE_KEY } from "../../utils/localStorageKey";
import { IPaginacion } from "../../interfaces/IPaginacion";
import { PaginacionUtils } from "../../utils/paginacion-util";
@Component({
  selector: "app-categorias",
  templateUrl: "./categorias.page.html",
  styleUrls: ["./categorias.page.scss"],
  providers: [SideBarService],
})
export class CategoriasPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  public cordenada: number;
  public paginacion: IPaginacion = {
    actualPagina: 1,
    siguientePagina: 1,
    mensaje: "",
  };
  public listaCategorias: Array<any>;
  private Filtros: FiltrosModel;
  public imgMobil: boolean;
  public isIOS: boolean = false;
  constructor(
    private busquedaService: BusquedaService,
    private sideBarService: SideBarService,
    private platform: Platform,
    private router: Router
  ) {
    this.Filtros = new FiltrosModel();
    this.Filtros.idEstado = 29;
    this.isIOS = this.platform.is("ios");
    this.listaCategorias = new Array<any>();
  }

  ngOnInit() {
    if (localStorage.getItem("isRedirected") === "false" && !this.isIOS) {
      localStorage.setItem("isRedirected", "true");
      location.reload();
    }
    this.obtenerCategorias();
    if (window.innerWidth <= 768) {
      this.imgMobil = true;
    } else {
      this.imgMobil = false;
    }
  }

  @HostListener("window:resize", ["$event"])
  onResize(event) {
    if (window.innerWidth <= 768) {
      this.imgMobil = true;
    } else {
      this.imgMobil = false;
    }
  }

  obtenerCategorias() {
    this.busquedaService
      .obtenerCategorias(this.paginacion.siguientePagina)
      .subscribe(
        (response) => {
          this.listaCategorias.push(...response.data.data);
          this.paginacion = PaginacionUtils.establecerDatosDePaginacion(
            response.data
          );
        },
        (error) => {
          alert(error);
        }
      );
  }

  seleccionarCategoria(subCategoria) {
    localStorage.setItem("todo", "todo");
    localStorage.removeItem("byCategorias");
    localStorage.setItem("byCategorias", JSON.stringify(subCategoria));
    localStorage.setItem("seleccionado", JSON.stringify(subCategoria));
    let seleccionado2 = localStorage.setItem(
      "seleccionado",
      JSON.stringify(subCategoria)
    );
    localStorage.setItem(LOCAL_STORAGE_KEY.CATEGORIA_SELECCIONADA, "true");
    localStorage.removeItem("busqueda");
    localStorage.setItem("filter", "true");
    this.router.navigate(["/tabs/inicio"]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  cargarMasPaginas(evento: any) {
    if (
      this.paginacion.totalDePaginasPorConsulta < this.paginacion.totalDePaginas
    ) {
      this.obtenerCategorias();
      setTimeout(() => {
        evento.target.complete();
      }, 800);
    } else {
      evento.target.disabled = true;
    }
  }
}
