import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { PedidosService } from "../../../api/pedidos.service";
import { UtilsCls } from "../../../utils/UtilsCls";
import { IonContent, ModalController, Platform } from "@ionic/angular";
import { DatosPedidoNegocioPage } from "./datos-pedido-negocio/datos-pedido-negocio.page";
import { Router, ActivatedRoute } from "@angular/router";
import { LoadingController } from "@ionic/angular";

@Component({
  selector: "app-pedidos-negocio",
  templateUrl: "./pedidos-negocio.page.html",
  styleUrls: ["./pedidos-negocio.page.scss"],
})
export class PedidosNegocioPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  public cordenada: number;
  listaNegocioPedididos: any;
  public listaEstatus: any;
  public lstFiltroEstatus: any;
  public selectTO: any;
  public subscribe;
  public loaderSearch = false;
  public loaderBus = false;
  public loaderEst = false;

  constructor(
    private pedidosServicios: PedidosService,
    private utilsCls: UtilsCls,
    public modalController: ModalController,
    private router: Router,
    private active: ActivatedRoute,
    public loadingController: LoadingController,
    private platform: Platform
  ) {
    this.listaNegocioPedididos = [];
    this.lstFiltroEstatus = [1, 2, 3, 4, 5, 6];
  }

  ngOnInit() {
    this.loaderBus = true;
    this.loaderEst = true;
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
  }

  buscar() {
    const id = this.utilsCls.getIdProveedor();
    this.pedidosServicios
      .pedidosNegocios(null, id, this.lstFiltroEstatus)
      .subscribe(
        (res) => {
          this.listaNegocioPedididos = res.data;
          this.loaderBus = false;
          this.loaderSearch = false;
        },
        (error) => {
          this.loaderBus = false;
          this.loaderSearch = false;
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
        this.loaderEst = false;
      },
      (error) => {
        this.loaderEst = false;
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
    this.visto(pedido.id_pedido_negocio);
    this.router.navigate(["/tabs/home/ventas/datos-pedido-negocio"], {
      queryParams: { special: navigationExtras },
    });
  }

  regresar() {
    this.subscribe.unsubscribe();
    this.router.navigate(["/tabs/inicio"], { queryParams: { special: true } });
  }

  visto(pedido) {
    this.pedidosServicios.ponerVisto(pedido).subscribe(
      (respuesta) => {},
      (error) => {}
    );
  }

  public loading(pc: any, pr: any) {
    return pc === true && pr === true ? true : false;
  }
}
