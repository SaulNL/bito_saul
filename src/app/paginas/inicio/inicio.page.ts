import { Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { LoadingController, MenuController, ModalController, ToastController } from "@ionic/angular";
import { BusquedaService } from "../../api/busqueda.service";
import { FiltrosModel } from '../../Modelos/FiltrosModel';
import { Router } from "@angular/router";
import { FiltrosBusquedaComponent } from "../../componentes/filtros-busqueda/filtros-busqueda.component";
import { ToadNotificacionService } from "../../api/toad-notificacion.service";
import { PromocionesService } from '../../api/busqueda/proveedores/promociones.service';
import { FormControl } from '@angular/forms';
import { IonSlides } from '@ionic/angular';
import { NavBarServiceService } from '../../../app/api/busqueda/nav-bar-service.service';
import { UbicacionModel } from '../../Modelos/busqueda/UbicacionModel';
import { PromocionesModel } from '../../Modelos/busqueda/PromocionesModel';


@Component({
    selector: 'app-tab3',
    templateUrl: 'inicio.page.html',
    styleUrls: ['inicio.page.scss']
})
export class InicioPage implements OnInit {
    private loaderPrincipal: HTMLIonLoadingElement;
    private Filtros: FiltrosModel;
    public listaCategorias: any;
    private modal: any;
    public anyFiltros: FiltrosModel;
    strBuscar: any;
    public filterMunicipio = new FormControl();
    public miUbicacionlatitud: number;
    public miUbicacionlongitud: number;
    public kilometrosView: number;
    public tipoNegocio: any;
    public tipoProducto: any;
    public entregaDomicilio: boolean;
    lstPromociones: any;
    public lstAvisos: any;
    public listaPrueba: any;
    promocionDefault: any;
    slideOptsOne = {
        initialSlide: 0,
        slidesPerView: 1,
        autoplay: true
    };
    @ViewChild('mySlider') slides: IonSlides;
    public ubicacion = new UbicacionModel();
    public promocion: PromocionesModel;
    public numeroVistas: number;
    public urlNegocio: string;
    constructor(
        public loadingController: LoadingController,
        private _router: Router,
        private toadController: ToastController,
        private principalSercicio: BusquedaService,
        private modalController: ModalController,
        private notificaciones: ToadNotificacionService,
        private servicioPromociones: PromocionesService,
        private navBarServiceService: NavBarServiceService
    ) {
        this.Filtros = new FiltrosModel();
        this.Filtros.idEstado = 29;
        this.listaCategorias = [];
        this.lstPromociones = [];
        this.listaPrueba = [];
    }

    ngOnInit(): void {
        this.buscarNegocios();
        this.obtenerPromociones();
        this.obtenerAvisos();
    }
    swipeNext() {
        this.slides.slideNext();
    }
    swipePrev() {
        this.slides.slidePrev();
    }
    buscarNegocios() {
        this.presentLoading().then(a => { });
        this.principalSercicio.obtenerDatos(this.Filtros).subscribe(
            respuesta => {
                this.listaCategorias = respuesta.data;
                this.loaderPrincipal.onDidDismiss();
            },
            error => {

                this.notificaciones.error('Error al buscar los datos')
                this.loaderPrincipal.onDidDismiss();
            }
        );
    }

    async presentLoading() {
        this.loaderPrincipal = await this.loadingController.create({
            message: 'Cargando. . .',
            duration: 1000
        });
        return await this.loaderPrincipal.present();
    }


    async configToad(mensaje) {
        const toast = await this.toadController.create({
            color: 'dark',
            duration: 2000,
            message: mensaje
        });
        return await toast.present();
    }

    buscarToolbar(event) {
        this.Filtros.strBuscar = event;
        this.buscarNegocios();
    }

    abrirFiltros() {
        this.presentModal();
    }

    async presentModal() {
        let eventEmitter = new EventEmitter();
        eventEmitter.subscribe(res => {
            this.modal.dismiss({
                'dismissed': true
            });
            this.Filtros = res;
            console.log(res);
            this.buscarNegocios();
        });
        this.modal = await this.modalController.create({
            component: FiltrosBusquedaComponent,
            componentProps: {
                buscarPorFiltros: eventEmitter,
                filtros: this.Filtros
            }
        });
        return await this.modal.present();
    }
    /**
      * Funcion para obtener las promociones
      * @author Omar
      */
    public obtenerPromociones() {
        // this.loaderPromo = true;
        this.anyFiltros = new FiltrosModel(this.strBuscar,
            null, this.filterMunicipio.value, this.kilometrosView,
            this.miUbicacionlatitud, this.miUbicacionlongitud, this.tipoNegocio, this.tipoProducto, this.entregaDomicilio);

        this.servicioPromociones.buscarPromocinesPublicadasFiltros(this.anyFiltros).subscribe(
            response => {
                this.lstPromociones = response.data;
                //this.loaderPromo = false;
            },
            error => {
                // this._notificacionService.pushError(error);
            }
        );
    }
    /**
       * Funcion para obtener avisos
    */
    public obtenerAvisos() {
        // this.loaderPromo = true;
        this.servicioPromociones.obtenerAvisos().subscribe(
            response => {
                this.lstAvisos = response.data;
                // this.loaderPromo = false;
            },
            error => {
                //this._notificacionService.pushError(error);
            }
        );
    }
    /**
      * funcion para obtener la informacion de las promociones
      * @param promocion
      * @author Omar
      */
    accionPromocion(promocion, ruta) {
        this.urlNegocio = ruta + promocion.url_negocio;
        this.promocion = promocion;
        this.visteMiPromocion(promocion);
        this.quienNumeroVioPublicacion(promocion.id_promocion);
        this.rutaLink(this.urlNegocio);
        setTimeout(() => {
            this.navBarServiceService.promocionSeleccionada(promocion);
        }, 1500);
    }
    /**
      * Funcion para enlazar a otra pagina
      * @param ruta
      * @author Omar
      */
    rutaLink(ruta: string) {
        //this._router.navigateByUrl('#' + ruta, { skipLocationChange: true });
        setTimeout(() => this._router.navigate([ruta]));
    }
    /**
   * Funcion para guardar el quien vio la promocion
   * @param promocion
   * @author Omar
   */
    visteMiPromocion(promocion: PromocionesModel) {
        this.ubicacion.latitud = this.miUbicacionlatitud;
        this.ubicacion.longitud = this.miUbicacionlongitud;
        this.servicioPromociones.guardarQuienVioPromocion(promocion, this.ubicacion).subscribe(
            response => {
                if (response.code === 200) {
                }
            },
            error => {
            }
        );
    }
    /**
 * funcion para obtener el detalle de quien ha visto la publicacion
 * @param id_promocion
 * @autor Omar
 */
    quienNumeroVioPublicacion(id_promocion) {
        this.servicioPromociones.obtenerNumeroQuienVioPublicacion(id_promocion).subscribe(
            response => {
                this.numeroVistas = response.data;
            },
            error => {
            }
        );
    }
}
