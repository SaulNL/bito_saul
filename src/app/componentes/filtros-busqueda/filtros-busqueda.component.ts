import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ModalController} from "@ionic/angular";
import {FiltrosModel} from "../../Modelos/FiltrosModel";
import {Plugins} from '@capacitor/core';
import {FiltrosService} from "../../api/filtros.service";

const {Geolocation} = Plugins;

@Component({
    selector: 'app-filtros-busqueda',
    templateUrl: './filtros-busqueda.component.html',
    styleUrls: ['./filtros-busqueda.component.scss'],
})
export class FiltrosBusquedaComponent implements OnInit {
    @Output() private buscarPorFiltros = new EventEmitter();
    private currentModal: any;
    @Input() filtros: FiltrosModel;
    private lstCatTipoNegocio: any;
    ubicacion: any;
    private lstCatEstados: any;
    estado: any;
    private listCaLocalidad: any;
    private listCatMunicipio: any;
    municipio: any;
    localidad: any;
    categoria: any;
    lstCatTipoProducto: any;
    listaCategorias: any;
    subCategoria: any;


    constructor(
        private modalCtrl: ModalController,
        private filtroServicio: FiltrosService
    ) {
        this.ubicacion = 'localidad';
        this.lstCatTipoProducto = [];
        this.lstCatTipoNegocio = [];
        this.lstCatEstados = [];
        this.listCaLocalidad = [];
        this.listaCategorias = [];
        this.listCatMunicipio = [];
        this.obtenerCatalogos();
        this.getCurrentPosition();
        this.obtenerCatEstados();
        this.obtenergiros()
    }

    async getCurrentPosition() {
        const coordinates = await Geolocation.getCurrentPosition().then(res => {
            console.log(res)
        }).catch(error => {
            console.log(error, 'asdasdsad')
            }
        );
    }

    ngOnInit() {

    }

    public obtenergiros() {
        this.filtroServicio.obtenerGiros().subscribe(
            response => {
                this.lstCatTipoProducto = response.data;
            },
            error => {
            }
        );
    }

    public obtenerCatEstados() {
        this.filtroServicio.obtenerEstados().subscribe(
            response => {
                this.lstCatEstados = response.data.lst_estado_proveedor;
            },
            error => {
                console.error(error);
            }
        );
    }


    public obtenerCatalogos() {
        this.filtroServicio.tipoNegocios().subscribe(
            response => {
                this.lstCatTipoNegocio = response.data.catTipoNegocio;
            },
            error => {
            }
        );
    }

    cerrarModal() {
        this.modalCtrl.dismiss({
            'dismissed': true
        });
    }

    buscar() {
        this.buscarPorFiltros.emit(this.filtros)
    }

    selectEstado() {
        this.filtros.idEstado = this.estado;
        this.obtenerCatMunicipio();
    }

    public obtenerCatMunicipio() {
        this.filtroServicio.obtenerMunicipios(this.estado).subscribe(
            response => {
                this.listCatMunicipio = response.data.list_cat_municipio;
            },
            error => {
                console.error(error);
            }
        );
    }

    public obtenerCatLocalidad() {
        this.filtroServicio.getLocalidad(this.municipio).subscribe(
            response => {
                this.listCaLocalidad = response.data.list_cat_localidad;
            },
            error => {
                console.error(error);
            }
        );
    }


    selectMunicipio() {
        this.filtros.idMunicipio = this.municipio;
        this.obtenerCatLocalidad();
    }

    selectLocalidad() {
        this.filtros.idLocalidad = this.localidad;
    }

    selectCategoria() {
        this.filtros.idGiro = [this.categoria]
        this.subCategorias();
    }

    subCategorias(){
        this.filtroServicio.obtenerCategoriasGiro(this.categoria).subscribe(
            response => {
                this.listaCategorias = response.data;
                this.listaCategorias.map(item => {
                    item.estaSeleccionado = false;
                });

            },
            error => {
            }
        );
    }

    selectSubCategoria() {
        console.log(this.subCategoria)
        this.filtros.idCategoriaNegocio = [this.subCategoria]
    }
}
