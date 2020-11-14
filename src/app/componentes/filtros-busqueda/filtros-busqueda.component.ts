import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModalController } from "@ionic/angular";
import { FiltrosModel } from "../../Modelos/FiltrosModel";
import { Plugins } from '@capacitor/core';
import { FiltrosService } from "../../api/filtros.service";
import { CatTipoNegocioModel } from 'src/app/Modelos/CatTipoNegocioModel';

const { Geolocation } = Plugins;
declare var google: any;

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
    blnUbicacion: boolean;
    miUbicacionlongitud: number;
    miUbicacionlatitud: number;
    estasUbicacion: string;
    kilometrosSlider: number;
    tipoNegocio: number;
    listaTipoNegocio: any;



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
        this.obtenergiros();
        this.listaTipoNegocio = [];
    }

    async getCurrentPosition() {
        const coordinates = await Geolocation.getCurrentPosition().then(res => {
            //console.log(res);
            this.blnUbicacion = true;
            this.miUbicacionlatitud = res.coords.latitude;
            this.miUbicacionlongitud = res.coords.longitude;
            this.filtros.latitud = this.miUbicacionlatitud;
            this.filtros.longitud = this.miUbicacionlongitud;
            try {
                this.geocodeLatLng();
            } catch (e) {
                console.error(e);
            }
        }).catch(error => {
            console.log(error, 'asdasdsad');
            this.blnUbicacion = false;
        }
        );
    }

    ngOnInit() {
        this.miUbicacionlongitud = 0;
        this.miUbicacionlatitud = 0;
        this.kilometrosSlider = 1;
        this.filtros.kilometros = 1;
        this.filtros.tipoBusqueda = 0;
        this.tipoNegocio = 0;
        if (this.filtros.idEstado !== null) {
            this.estado = this.filtros.idEstado;
            console.log(this.estado);
            this.obtenerCatMunicipio();
        } else if (this.filtros.idEstado === null) {
            this.filtros.idEstado = 29;
            this.estado = this.filtros.idEstado;
        }
        if (this.filtros.idMunicipio !== null) {
            this.municipio = this.filtros.idMunicipio;
            this.obtenerCatLocalidad();
        }
        if (this.filtros.idLocalidad !== null) {
            this.localidad = this.filtros.idLocalidad;
        }
        if (this.filtros.idGiro != null) {
            this.categoria = this.filtros.idGiro;
            this.subCategorias();
        }
        console.log(this.filtros);
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
                this.validarCheckbox();
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
        this.filtros.idTipoNegocio = this.listaTipoNegocio;
        if (this.filtros.tipoBusqueda === 1) {
            this.filtros.idEstado = null;
            this.filtros.idMunicipio = null;
            this.filtros.idLocalidad = null;
        }
        this.buscarPorFiltros.emit(this.filtros)
    }

    selectEstado(event) {
        //console.log(event.detail.value);
        //this.estado=parseInt(event.detail.value);
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

    public geocodeLatLng() {
        // @ts-ignore
        const geocoder = new google.maps.Geocoder;
        const latlng = {
            lat: parseFloat(String(this.miUbicacionlatitud)),
            lng: parseFloat(String(this.miUbicacionlongitud))
        };
        geocoder.geocode({ location: latlng }, (results, status) => {
            if (status === 'OK') {
                if (results[0]) {
                    //this.loader = false;

                    let posicion = results[0].address_components.length;
                    posicion = posicion - 4;
                    this.estasUbicacion = results[0].formatted_address;
                    this.filtros.strMunicipio = results[0].address_components[posicion].long_name;
                } else {
                    //console.log('No results found');
                }
            } else {
                //console.log('Geocoder failed due to: ' + status);
                //this.loader = false;
            }
        });
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

    subCategorias() {
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

    public selectTipoNegocio(evento) {
        if (evento.detail.checked === true) {
            this.listaTipoNegocio.push(parseInt(evento.detail.value));
        }
        if (parseInt(evento.detail.value) === 3 && evento.detail.checked === true) {
            var checkboxs = document.getElementsByTagName("ion-checkbox");
            for (let j = 0; j < checkboxs.length; j++) {
                checkboxs[j].setAttribute('checked', 'true');
            }
        }
    }

    setIonradiogroupEntregaDomicilio(opcion: number) {
        if (opcion === 1) {
            this.filtros.blnEntrega = true;
        } else if (opcion === 0) {
            this.filtros.blnEntrega = false;
        }
    }
    setIonradiogroupAbiertoCerrado(opcion: number) {
        if (opcion === 1) {
            this.filtros.abierto = true;
        } else if (opcion === 0) {
            this.filtros.abierto = false;
        }
    }
    obtenerKilometrosRango(event) {
        this.kilometrosSlider = event.detail.value;
        this.filtros.kilometros = this.kilometrosSlider;
    }
    setTipo(tipo: string) {
        if (tipo === 'localidad') {
            this.filtros.tipoBusqueda = 0;
        } else if (tipo === 'ubicacion') {
            this.filtros.tipoBusqueda = 1;
        }
    }
    borrarFiltros() {
        this.filtros = new FiltrosModel();
        this.listaTipoNegocio = [];
        this.buscar();
    }
    validarCheckbox() {
        setTimeout(it => {
            var checkboxs = document.getElementsByTagName("ion-checkbox");
            if (this.filtros.idTipoNegocio !== null) {
                for (let i = 0; i < this.filtros.idTipoNegocio.length; i++) {
                    for (let j = 0; j < checkboxs.length; j++) {
                        if (this.filtros.idTipoNegocio[i] === parseInt(checkboxs[j].value)) {
                            checkboxs[j].setAttribute('checked', 'true');
                        }
                    }
                }
            }
        }, 700);
    }
}
