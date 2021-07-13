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
    public datosRoles: any;
    public rol: number;
    public scroll: boolean;
    public mensaje: any;
    public listaNegociosOriginal: any;

    constructor(
        private servicioNegocios: NegocioService,
        private actionSheetController: ActionSheetController,
        private modalController: ModalController
    ) {
        this.listaNegocios = [];
        this.usuario = JSON.parse(localStorage.getItem('u_data'));
        this.datosRoles = JSON.parse(localStorage.getItem('u_roles'));
    }

    ngOnInit() {
        this.scroll = true;
        this.mensaje = '';
        this.obtenerRol();
        this.buscarListaNegocios();
    }

    public obtenerRol() {
        for (let index = 0; index < this.datosRoles.length; index++) {
            if (this.datosRoles[index].id_rol === 1) {
                this.rol = 1;
            }
        }
    }

    public buscarListaNegocios() {
        this.loader = true;
        if (this.usuario.proveedor != null) {
            this.servicioNegocios.misNegociosEstadisticas(this.usuario.proveedor.id_proveedor, this.rol).subscribe(
                (resp) => {
                    if (this.rol === 1){
                        this.listaNegociosOriginal = resp.data;
                        this.listaNegocios = this.listaNegociosOriginal.slice(0, 12);
                    }else{
                        this.listaNegocios = resp.data;
                    }
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
    }

    public cargarMasNegocios(event) {
        setTimeout(() => {
            event.target.complete();
            if (this.listaNegocios.length < this.listaNegociosOriginal.length) {
                let len = this.listaNegocios.length;
                for (let i = len; i <= len + 6; i++) {
                    if (this.listaNegociosOriginal[i] === undefined) {
                        this.scroll = false;
                        break;
                    }
                    this.listaNegocios.push(this.listaNegociosOriginal[i]);
                }
            }
        }, 500);
    }




}
