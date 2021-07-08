import {Component, OnInit} from '@angular/core';
import {NegocioModel} from '../../Modelos/NegocioModel';
import {NegocioService} from '../../api/negocio.service';
import {ActionSheetController, ModalController} from '@ionic/angular';
import {ComentariosNegocioComponent} from '../../componentes/comentarios-negocio/comentarios-negocio.component';
import {EstadisticasComponent} from '../../componentes/estadisticas/estadisticas.component';

@Component({
    selector: 'app-estadisticas',
    templateUrl: './estadisticas.page.html',
    styleUrls: ['./estadisticas.page.scss'],
})
export class EstadisticasPage implements OnInit {

    public listaNegocios: Array<NegocioModel>;
    public usuario: any;
    public loader: boolean;

    constructor(
        private servicioNegocios: NegocioService,
        private  actionSheetController: ActionSheetController,
        private modalController: ModalController
    ) {
        this.listaNegocios = [];
        this.usuario = JSON.parse(localStorage.getItem('u_data'));
    }

    ngOnInit() {
        this.buscarListaNegocios();
    }

    public buscarListaNegocios() {
        this.loader = true;
        if (this.usuario.proveedor != null) {
            this.servicioNegocios
                .misNegocios(this.usuario.proveedor.id_proveedor)
                .subscribe(
                    (resp) => {
                        this.listaNegocios = resp.data;
                        this.loader = false;
                    },
                    (error) => {
                        this.loader = false;
                    },
                    () => {
                        window.scrollTo({top: 0, behavior: 'smooth'});
                    }
                );
        } else {
            this.loader = false;
        }
    }

    async abrirModalEstadisticas(negocio) {
        const modal = await this.modalController.create({
            component: EstadisticasComponent,
            componentProps: {
                idNegocio: negocio
            },
        });
        await modal.present();
        /*const { data } = await modal.onDidDismiss();
        if (data !== undefined) {
          this.informacionNegocio.numCalificaciones = data.numCalificaciones;
          this.informacionNegocio.promedio = data.promedio;
          this.obtenerEstatusCalificacion();

        }*/
    }

    async  listarEstadisticas() {
        const actionSheet = await this.actionSheetController.create({
            header: 'Elige una estadística',
            buttons: [
                { text: 'Vistas', },
                { text: 'Likes negocio' },
                { text: 'Calificaciones' },
                { text: 'Likes productos' },
                { text: 'Solicitudes' },
                { text: 'Promociones' },
                { text: 'Cancel', role: 'cancel' }
            ]
        });

        await actionSheet.present();
    }


}
