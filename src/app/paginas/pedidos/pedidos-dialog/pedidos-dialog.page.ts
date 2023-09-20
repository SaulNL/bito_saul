import {
  Component,
  OnInit,
  ViewChild
} from "@angular/core";
import {
  UtilsCls
} from "../../../utils/UtilsCls";
import {
  PedidosService
} from "../../../api/pedidos.service";
import {
  icon,
  latLng,
  Map,
  marker,
  tileLayer
} from "leaflet";
import {
  Router,
  ActivatedRoute
} from "@angular/router";
import {
  IonContent,
  Platform
} from "@ionic/angular";
import {
  Location
} from "@angular/common";
import {
  IPedidosNegocios
} from "src/app/interfaces/pedidos/IPedidosNegocio";

import {
  IFiltroBusqueda
} from "src/app/interfaces/pedidos/IFiltroBusqueda";

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
  public inicioFecha: any;
  public finalFecha: any;
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
    private platform: Platform,


  ) {
    this.listaNegocioPedididos = [];
    this.lstFiltroEstatus = [1, 2, 3, 4, 5, 6];
    this.loaderBtn = false;
    this.blnCancelar = false;
    this.inicioFecha = "";
    this.finalFecha = "";
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

  format(fecha: String) {
    var cadena = fecha.replace("/", "-");
    var dia = cadena.substring(0, cadena.indexOf("-"));
    var copia = cadena.substring(cadena.indexOf("-") + 1);
    var mes = copia.substring(0, copia.indexOf("/"));
    var year = cadena.substring(cadena.lastIndexOf("/") + 1);
    cadena = year + "-" + mes + "-" + dia;
    var salida = Date.parse(cadena);
    var fecha2 = new Date(salida);
    return fecha2;
  }
  dayFecha() {
    var actual = new Date();
    var mon = "" + (actual.getMonth() + 1);
    if (mon.length == 1) {
      mon = "0" + mon;
    }
    var day = "" + actual.getDate();
    if (day.length == 1) {
      day = "0" + day;
    }
    return actual.getFullYear() + "-" + mon + "-" + day;

  }
  weekFecha() {
    var actual = new Date();
    actual.setDate(actual.getDate() - 7);
    var mon = "" + (actual.getMonth() + 1);
    if (mon.length == 1) {
      mon = "0" + mon;
    }
    var day = "" + actual.getDate();
    if (day.length == 1) {
      day = "0" + day;
    }
    return actual.getFullYear() + "-" + mon + "-" + day;

  }

  format2(fecha: String) {
    var cadena = fecha.substring(0, fecha.indexOf("T"));
    return cadena;
  }

  moothFecha() {
    var actual = new Date();
    actual.setDate(actual.getDate() - 30);
    var mon = "" + (actual.getMonth() + 1);
    if (mon.length == 1) {
      mon = "0" + mon;
    }
    var day = "" + actual.getDate();
    if (day.length == 1) {
      day = "0" + day;
    }
    return actual.getFullYear() + "-" + mon + "-" + day;

  }

  clickEvaluar(opcion: number) {
    this.inicioFecha = "";
    this.finalFecha = "";
    const id = this.utilsCls.getIdPersona();
    this.loaderB = true;
    this.loaderSearch = true;
    let pedidosNegocios: IPedidosNegocios = {
      id_persona: id,
      estatus: this.lstFiltroEstatus
    };
    if (opcion == 1) {
      pedidosNegocios.fecha_inicio = this.dayFecha();
      pedidosNegocios.fecha_final = this.dayFecha();
    }
    if (opcion == 2) {
      pedidosNegocios.fecha_inicio = this.weekFecha();
      pedidosNegocios.fecha_final = this.dayFecha();
    }
    if (opcion == 3) {
      pedidosNegocios.fecha_inicio = this.moothFecha();
      pedidosNegocios.fecha_final = this.dayFecha();
    }
    this.pedidosServicios
      .pedidosNegocios2(pedidosNegocios)
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
  fechasRengo() {
    const id = this.utilsCls.getIdPersona();
    this.loaderB = true;
    this.loaderSearch = true;
    let pedidosNegocios: IPedidosNegocios = {
      id_persona: id,
      estatus: this.lstFiltroEstatus
    };

    pedidosNegocios.fecha_inicio = this.format2(this.inicioFecha);
    pedidosNegocios.fecha_final = this.format2(this.finalFecha);
    this.pedidosServicios
      .pedidosNegocios2(pedidosNegocios)
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
  filtroParaBusquedas(filtroBusqueda: IFiltroBusqueda | null,
    esParaBuscaTodos: boolean = false) {

    if (filtroBusqueda) {
      /*  this.fechaFinal = filtroBusqueda.fechaFinal;
        this.fechaInicio = filtroBusqueda.fechaInicio;*/
    }
    this.buscar()

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

  datosPedido(pedido: any, negocio: any) {
    const body = {
      'pedido': pedido,
      'negocio': negocio
    }
    this.selectTO = JSON.parse(JSON.stringify(body));
    let navigationExtras = JSON.stringify(this.selectTO);
    this.router.navigate(["/tabs/home/compras/datos-pedido-dialog"], {
      queryParams: {
        special: navigationExtras
      },
    });
  }

  regresar() {
    this.router.navigate(['/tabs/home'], {
      queryParams: {
        special: true
      }
    });
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