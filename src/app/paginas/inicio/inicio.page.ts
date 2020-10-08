import { Component } from '@angular/core';
import {LoadingController, ToastController} from "@ionic/angular";
import {BusquedaService} from "../../api/busqueda.service";
import {FiltrosModel} from '../../Modelos/FiltrosModel';
import {Router} from "@angular/router";

@Component({
  selector: 'app-tab3',
  templateUrl: 'inicio.page.html',
  styleUrls: ['inicio.page.scss']
})
export class InicioPage {
    private loaderPrincipal: HTMLIonLoadingElement;
    private Filtros: any;
    public listaCategorias: any;
    constructor(
        public loadingController: LoadingController,
        private _router: Router,
        private toadController: ToastController,
        private principalSercicio: BusquedaService
    ) {
        this.Filtros =  new FiltrosModel();
        this.listaCategorias = [];
        this.buscarNegocios();
    }

    buscarNegocios(){
        this.presentLoading().then(a => {});
        this.Filtros.idEstado = 29;
        this.principalSercicio.obtenerDatos(this.Filtros).subscribe(
            respuesta => {
                this.listaCategorias = respuesta.data;
                this.loaderPrincipal.onDidDismiss();
            },
            error => {
                this.configToad('Error al buscar los datos')
                this.loaderPrincipal.onDidDismiss();
            }
        );
    }

    async presentLoading() {
        const loading = await this.loadingController.create({
            message: 'Cargando. . .',
            duration: 5000
        });
        return await loading.present();
    }


    async configToad(mensaje) {
        const toast = await this.toadController.create({
            color: 'black',
            duration: 2000,
            message: mensaje
        });
        return await toast.present();
    }
}
