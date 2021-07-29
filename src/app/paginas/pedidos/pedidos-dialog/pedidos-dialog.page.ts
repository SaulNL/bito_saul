import { Component, OnInit, ViewChild } from "@angular/core";
import { UtilsCls } from "../../../utils/UtilsCls";
import { PedidosService } from "../../../api/pedidos.service";
import { icon, latLng, Map, marker, tileLayer } from "leaflet";
import { Router, ActivatedRoute } from "@angular/router";
import { IonContent, Platform } from "@ionic/angular";
import { Location } from "@angular/common";

@Component({
  selector: "app-pedidos-dialog",
  templateUrl: "./pedidos-dialog.page.html",
  styleUrls: ["./pedidos-dialog.page.scss"],
})
export class PedidosDialogPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  public cordenada: number;
  listaNegocioPedididos: any;
  public listaEstatus: any;
  public lstFiltroEstatus: any;
  public loaderBtn: boolean;
  public loaderB = false;
  public loaderBs = false;
  motivo: any;
  blnCancelar: boolean;
  private latitud: number;
  private longitud: number;
  pedidoAbierto: any;
  public selectTO: any;
  public subscribe;
  public navegacion: any;
  public loaderSearch = false;
public cargando = 'Cargando';
  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private pedidosServicios: PedidosService,
    private utilsCls: UtilsCls,
    private router: Router,
    private active: ActivatedRoute,
    private platform: Platform
  ) {
    this.listaNegocioPedididos = [];
    this.lstFiltroEstatus = [1, 2, 3, 4, 5, 6];
    this.loaderBtn = false;
    this.blnCancelar = false;
  }

  ngOnInit() {
    this.loaderB = true;
    this.loaderBs = true;
    this.buscar();
    this.buscarEstatus();
    this.active.queryParams.subscribe((params) => {
      if (params && params.special) {
        if (params.special) {
          this.buscar();
          this.buscarEstatus();
        }
      }
      this.subscribe = this.platform.backButton.subscribe(() => {
        this.regresar();
      });
    });

    this.route.queryParams.subscribe((params) => {
      if (params.route && params) {
        this.navegacion = true;
      }
    });
  }

  buscar() {
    const id = this.utilsCls.getIdPersona();
    //this.loader = true;
    this.pedidosServicios
      .pedidosNegocios(id, null, this.lstFiltroEstatus)
      .subscribe(
        (res) => {
          //this.loader = false;
          this.listaNegocioPedididos = res.data;
          this.loaderB = false;
          this.loaderSearch = false;
        },
        (error) => {
          this.loaderB = false;
          this.loaderSearch = false;
          //this.loader = false;
        }
      );
  }

  buscarEstatus() {
    const id = this.utilsCls.getIdProveedor();
    this.pedidosServicios.estatusPedidios(id).subscribe(
      (res) => {
        this.listaEstatus = res.data;
        this.listaEstatus.map((it) => {
          it.seleccionado = false;
          if (it.id_estatus > 0 && it.id_estatus < 7) {
            it.seleccionado = true;
          }
        });
        this.loaderBs = false;
      },
      (error) => {
        this.loaderBs = false;
        //this.loader = false;
      }
    );
  }

  buscarPorestatus(estatus: any) {
    this.loaderSearch = true;
    estatus.seleccionado = !estatus.seleccionado;
    this.lstFiltroEstatus = [];
    this.listaEstatus.map((it) => {
      if (it.seleccionado) {
        this.lstFiltroEstatus.push(it.id_estatus);
      }
    });
    this.buscar();
  }

  datosPedido(pedido: any) {
    this.selectTO = JSON.parse(JSON.stringify(pedido));
    let navigationExtras = JSON.stringify(this.selectTO);
    this.router.navigate(["/tabs/home/compras/datos-pedido-dialog"], {
      queryParams: { special: navigationExtras },
    });
  }

  regresar() {

     this.location.back();

    // if (this.navegacion) {
    //   this.location.back();
    //   this.navegacion = false;
    // } else {
    //   this.router.navigate(["/tabs/inicio"]);
    // }
    /* this.subscribe.unsubscribe();
         this.router.navigate(['/tabs/inicio'],{ queryParams: {special: true}  });*/
  }
  public loading(pc: any, pr: any) {
    return pc === true && pr === true ? true : false;
  }
}
