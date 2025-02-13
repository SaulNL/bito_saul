import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModalController } from "@ionic/angular";
import { FiltrosModel } from "../../Modelos/FiltrosModel";
import { FiltrosService } from "../../api/filtros.service";
import { CatTipoNegocioModel } from 'src/app/Modelos/CatTipoNegocioModel';
import {CatDistintivosModel} from '../../Modelos/CatDistintivosModel';
import { Geolocation } from '@capacitor/geolocation';

declare var google: any;

@Component({
    selector: 'app-filtros-busqueda',
    templateUrl: './filtros-busqueda.component.html',
    styleUrls: ['./filtros-busqueda.component.scss'],
})
export class FiltrosBusquedaComponent implements OnInit {
    @Output() private buscarPorFiltros = new EventEmitter();
    @Output() private eliminarPorFiltros = new EventEmitter();
    @Input() public isProductPage: boolean;
    private currentModal: any;
    @Input() filtros: FiltrosModel;
    public lstCatTipoNegocio: any;
    ubicacion: any;
    public lstCatEstados: any;
    estado: any;
    public listCaLocalidad: any;
    public listCatMunicipio: any;
    categoriaAux: any;
    estadoAux: any;
    subCategoriaAux: any;
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
    abierto: string = 'abiertos/cerrados';
    public lstDistintivos: Array<CatDistintivosModel>;
    public distintivo: any;
    distintivoAux: any;

    constructor(
        private modalCtrl: ModalController,
        private filtroServicio: FiltrosService
    ) {
        // this.ubicacion = 'localidad';
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
        const gpsOptions = { maximumAge: 30000000, timeout: 2000, enableHighAccuracy: true };
        const coordinates = await Geolocation.getCurrentPosition(gpsOptions).then(res => {

            this.blnUbicacion = true;
            this.miUbicacionlatitud = res.coords.latitude;
            this.miUbicacionlongitud = res.coords.longitude;
            this.filtros.latitud = this.miUbicacionlatitud;
            this.filtros.longitud = this.miUbicacionlongitud;
            try {
                this.ubicacion = 'ubicacion';
                this.filtros.tipoBusqueda = 1;
                this.geocodeLatLng();
            } catch (e) {

            }
        }).catch(error => {

            this.blnUbicacion = false;
            this.ubicacion = 'localidad';
            this.filtros.tipoBusqueda = 0;
        }
        );
    }

    ngOnInit() {
        this.miUbicacionlongitud = 0;
        this.miUbicacionlatitud = 0;
        this.kilometrosSlider = 1;
        this.tipoNegocio = 0;
        this.obtenerCatDistintivos();
        if (this.filtros.idEstado !== null) {
            this.estado = this.filtros.idEstado;
            this.obtenerCatMunicipio();
        } else if (this.filtros.idEstado === null) {
            this.filtros.idEstado = 29;
            this.estado = this.filtros.idEstado;
            this.obtenerCatMunicipio();
        }
        if (this.filtros.idMunicipio !== null) {
            this.municipio = this.filtros.idMunicipio;
            this.obtenerCatLocalidad();
        }
        if (this.filtros.idLocalidad !== null) {
            this.localidad = this.filtros.idLocalidad;
        }
        if (this.filtros.idGiro !== null) {
            this.categoria = this.filtros.idGiro;
            this.subCategorias();
        }
        if (this.filtros.idCategoriaNegocio !== null) {
            this.subCategoria = this.filtros.idCategoriaNegocio;
        }
        if (this.filtros.idDistintivo !== null){
            this.distintivo = this.filtros.idDistintivo;
        }
        if (this.filtros.kilometros <= 10) {
            this.kilometrosSlider = this.filtros.kilometros;
        }
        if (this.isProductPage) {
            this.subCategorias();
        }
    }

    public obtenergiros() {
        this.filtroServicio.obtenerGiros().subscribe(
            response => {
                this.lstCatTipoProducto = response.data;
                this.lstCatTipoProducto.forEach(element => {
                    if (element.id_giro == this.categoria) {
                        this.categoriaAux = element.nombre;

                    }
                });
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
                this.lstCatEstados.forEach(element => {
                    if (element.id_estado == this.estado) {
                        this.estadoAux = element.nombre;
                    }
                });
            },
            () => {

            }
        );
    }


    public obtenerCatalogos() {
        this.filtroServicio.tipoNegocios().subscribe(
            response => {
                let categorias = response.data.catTipoNegocio
                categorias.forEach(cat => {
                    if (cat.id_tipo_negocio != "3" || cat.id_tipo_negocio != 3) {
                        this.lstCatTipoNegocio.push(cat);
                    }
                });
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
        this.filtros.strBuscar = null;
        this.filtros.idTipoNegocio = this.listaTipoNegocio;
        if (this.filtros.tipoBusqueda === 1) {
            this.filtros.idEstado = null;
            this.filtros.idMunicipio = null;
            this.filtros.idLocalidad = null;
        }
        this.buscarPorFiltros.emit(this.filtros);
    }

    selectEstado(event) {

        this.filtros.idEstado = this.estado;
        this.obtenerCatMunicipio();
    }

    public obtenerCatMunicipio() {
        this.filtroServicio.obtenerMunicipios(this.estado).subscribe(
            response => {
                this.listCatMunicipio = response.data.list_cat_municipio;
            },
            () => {
            }
        );
    }

    public obtenerCatLocalidad() {
        this.filtroServicio.getLocalidad(this.municipio).subscribe(
            response => {
                this.listCaLocalidad = response.data.list_cat_localidad;
            },
            () => {

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

                }
            } else {

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
        this.filtros.idGiro = [this.categoria];
        this.subCategorias();
    }

    selectDistintivo(){
        this.filtros.idDistintivo = this.distintivo;
    }

    subCategorias() {
        // if (this.isProductPage) {
        //     this.categoria = null;
        // }
        if ( this.categoria !== null && this.categoria !== undefined ){
            this.filtroServicio.obtenerCategoriasGiro(this.categoria).subscribe(
                response => {
                    this.listaCategorias = response.data;
                    this.listaCategorias.map(item => {
                        item.estaSeleccionado = false;
                    });

                    this.listaCategorias.forEach(element => {
                        if (this.filtros.idCategoriaNegocio !== null) {
                            this.filtros.idCategoriaNegocio.forEach(elementCategoria => {
                                if (elementCategoria == element.id_categoria) {
                                    this.subCategoriaAux = element.nombre;
                                }
                            });
                        }

                    });

                },
                error => {
                }
            );
        }
    }

    selectSubCategoria() {
        this.filtros.idCategoriaNegocio = this.subCategoria;
    }

    public obtenerCatDistintivos() {
        this.filtroServicio.obtenerCatDistintivos().subscribe((response) => {
            this.lstDistintivos = response.data;
            this.lstDistintivos.forEach(element => {
                if (element.id_distintivo == this.distintivo) {
                    this.distintivoAux = element.nombre;
                }
            });
        });
    }


    public selectTipoNegocio(evento) {
        if (evento.detail.checked === true) {
            this.listaTipoNegocio.push(parseInt(evento.detail.value));
        } else if (evento.detail.checked === false) {
            const index = this.listaTipoNegocio.indexOf(parseInt(evento.detail.value));
            this.listaTipoNegocio.splice(index, 1);
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
            this.filtros.abierto = opcion + '';
            this.abierto='abiertos'
        } else if (opcion === 0) {
            this.abierto='cerrados'
            this.filtros.abierto = opcion + '';
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
        localStorage.removeItem("todo")
        this.filtros = new FiltrosModel();
        this.listaTipoNegocio = [];
        this.buscar();
        this.eliminarPorFiltros.emit(false);
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
