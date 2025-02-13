import { StatisticsByBusinessInterface, StatisticsByBusinessModel } from './../../Bitoo/models/statistic-model';
import { BusinessStatisticModel } from './../../Bitoo/models/query-params-model';
import { Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NegocioModel } from '../../Modelos/NegocioModel';
import { NegocioService } from '../../api/negocio.service';
import { ActionSheetController, IonContent, ModalController } from '@ionic/angular';

@Component({
    selector: 'app-estadisticas',
    templateUrl: './estadisticas.page.html',
    styleUrls: ['./estadisticas.page.scss'],
})
export class EstadisticasPage implements OnInit {
    @ViewChild(IonContent) content: IonContent;
    public cordenada: number;
    public listaNegocios: Array<NegocioModel>;
    public usuario: any;
    public loader: boolean;
    public datosRoles: any;
    public rol: number;
    public scroll: boolean;
    public mensaje: any;
    public listaNegociosOriginal: any;
    public msj = 'Cargando';

    constructor(
        private servicioNegocios: NegocioService,
        private actionSheetController: ActionSheetController,
        private modalController: ModalController,
        private route: Router
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
                    if (this.rol === 1) {
                        this.listaNegociosOriginal = resp.data;
                        this.listaNegocios = this.listaNegociosOriginal.slice(0, 12);
                    } else {
                        this.listaNegocios = resp.data;
                    }
                    this.loader = false;
                },
                (error) => {
                    this.loader = false;
                },
                () => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            );
        } else {
            this.loader = false;
        }
    }
    public showStatisticByBusiness(idBusiness: number) {
        const content: StatisticsByBusinessInterface = new StatisticsByBusinessModel(idBusiness);
        const queryParams: BusinessStatisticModel = new BusinessStatisticModel(JSON.stringify(content));
        this.route.navigate(['tabs/home/estadisticas/statistics-by-business'], {
            queryParams: queryParams
        });
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
