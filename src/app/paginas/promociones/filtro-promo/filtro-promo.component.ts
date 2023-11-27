import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { FiltrosService } from 'src/app/api/filtros.service';
import { GeneralServicesService } from 'src/app/api/general-services.service';
import { PromocionesService } from 'src/app/api/promociones.service';
import { Geolocation } from '@capacitor/geolocation';
import  moment from 'moment';

@Component({
  selector: 'app-filtro-promo',
  templateUrl: './filtro-promo.component.html',
  styleUrls: ['./filtro-promo.component.scss'],
})
export class FiltroPromoComponent implements OnInit {
  customPopoverOptions = {
  };
  @Input() isFiltro: boolean;
  @Output() lstPromocionesFiltro = new EventEmitter<string>();
  @Output() filtroActivo = new EventEmitter<boolean>();

  formularioPromo: FormGroup;
  public lstEstados: any;
  public listCatMunicipio: any;
  public listCaLocalidad: any;
  public listPlazas: any;
  public lstPromociones: any;
  public lstTipoNegocio: any;
  public lstCategorias: any;
  public lstSubCategoria: any;
  public lstOcurrencia: any;
  public segment: string = 'localidad';
  public estasUbicacion: string;
  blnUbicacion: boolean;
  miUbicacionlatitud: number;
  miUbicacionlongitud: number;
  kilometrosSlider: number;

  constructor(
    private formBuilder: FormBuilder,
    private filtroServicio: FiltrosService,
    private generalService: GeneralServicesService,
    private _promociones: PromocionesService,
    private modalController: ModalController
  ) { 
    // this.obtenerPlazas();
    this.obtenerCatEstados();
    this.formularioPromo = this.formBuilder.group({
      fecha_fin: [null],
      fecha_inicio: [null],
      abierto: [null],
      blnEntrega: [null],
      idCategoriaNegocio: [[null]],
      idDistintivo: [null],
      idEstado: [29],
      idMunicipio: [null],
      idLocalidad: [null],
      idTipoNegocio: [[null]],
      id_persona: [null],
      idGiro:[[null]],
      intEstado: [0],
      kilometros: [1],
      latitud: [19.33836768406867],
      longitud: [-98.18386544575286],
      limpiarF: [false],
      organizacion: [null],
      strBuscar: [''],
      strMunicipio: [''],
      tipoBusqueda: [0],
      typeGetOption: [true],
    });
    this.catalogo()
    this.obtenerOcurrencia();
    this.getCurrentPosition();
  }

  ngOnInit() {
    this.kilometrosSlider = 10;
   }
  
  public obtenerCatEstados() {
        this.filtroServicio.obtenerEstados().subscribe(
            response => {
            this.lstEstados = response.data.lst_estado_proveedor;
            this.obtenerCatMunicipio();
            },
            () => {

            }
        );
  }
  public catalogo() {
        this.filtroServicio.tipoNegocios().subscribe(
            response => {
            let data = response.data;
            this.lstTipoNegocio = data.catTipoNegocioProductosServicios;
            this.lstCategorias = data.catTipoProducto;
            },
            () => {

            }
        );
  }

  subCategoria(event) {
    let categoria = [event.detail.value]
    this.formularioPromo.get('idGiro').setValue(categoria)
    this.filtroServicio.obtenerCategoriasGiro(event.detail.value).subscribe( response => {
      this.lstSubCategoria = response.data;
    },() => {

      });
  }
  categoriaSub(event) {
    let categoria = [event.detail.value]
    this.formularioPromo.get('idCategoriaNegocio').setValue(categoria)
  }
  
  public obtenerCatMunicipio() {
        this.filtroServicio.obtenerMunicipios(this.formularioPromo.get('idEstado').value).subscribe(
            response => {
            this.listCatMunicipio = response.data.list_cat_municipio;
            },
            () => {
            }
        );
  }
  
  public obtenerCatLocalidad() {
        this.filtroServicio.getLocalidad(this.formularioPromo.get('idMunicipio').value).subscribe(
            response => {
            this.listCaLocalidad = response.data.list_cat_localidad;
            },
            () => {

            }
        );
  }
  tipoNegocio(event) {
    let categoria = [event.detail.value]
    this.formularioPromo.get('idTipoNegocio').setValue(categoria)
  }
  
  // obtenerPlazas() {
  //   this.generalService.obtenerPlazas().subscribe(
  //     response => {
  //       if (response.code === 200 && response.data.length > 0) {
  //         this.listPlazas = response.data;
  //       }
  //     }, error => {
  //       console.log(error)
  //     }
  //   );
  // }

  buscarFiltros(borrarFiltros) {
    this.getCurrentPosition();
    let filtro = {
      filtros:this.formularioPromo.value
    }
    this._promociones.buscarPromocinesPublicadasModulo(this.formularioPromo.value).subscribe((response) => {
      if (response.code === 402) {
      }
      if (response.data !== null) {
        this.lstPromociones = response.data;
        this.lstPromocionesFiltro.emit(this.lstPromociones)
        this.filtroActivo.emit(borrarFiltros)
        this.modalController.dismiss();
      } else {
        this.lstPromociones = [];
        this.lstPromocionesFiltro.emit(this.lstPromociones)
        this.filtroActivo.emit(borrarFiltros)
        this.modalController.dismiss();
      }
    }, () => {
      this.lstPromociones = [];
    },() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  abiertoCerrado() {
    let abierto = this.formularioPromo.get('abierto').value == undefined ? null : this.formularioPromo.get('abierto').value;
    this.formularioPromo.get('abierto').setValue(abierto)
  }

  limpiarFiltro() {
    this.formularioPromo.reset();
    this.formularioPromo.get('idEstado').setValue(29);
    this.formularioPromo.get('intEstado').setValue(0);
    this.formularioPromo.get('kilometros').setValue(1);
    this.formularioPromo.get('latitud').setValue(0);
    this.formularioPromo.get('longitud').setValue(0);
    this.formularioPromo.get('strBuscar').setValue("");
    this.formularioPromo.get('strMunicipio').setValue("");
    this.formularioPromo.get('tipoBusqueda').setValue(0);
    this.formularioPromo.get('typeGetOption').setValue(true);
    this.kilometrosSlider = 10;
    this.buscarFiltros(false);
  }
  
    public obtenerOcurrencia() {
        this.filtroServicio.obtenerOcurrenciasPromo().subscribe((response) => {
          this.lstOcurrencia = response.data;
        });
  }
  
  public ocurrenciaSelect(event) {
    let fechaActual = moment();
    switch (event.detail.value) {
      case 1:
        this.formularioPromo.get('fecha_fin').setValue(null);
        this.formularioPromo.get('fecha_inicio').setValue(fechaActual.format('YYYY-MM-DD'));
        break;
      case 2:
        let fechaActual5 = fechaActual.add(1, 'weeks');
        this.formularioPromo.get('fecha_fin').setValue(fechaActual5.format('YYYY-MM-DD'));
        this.formularioPromo.get('fecha_inicio').setValue(fechaActual.format('YYYY-MM-DD'));
        break;
      case 3:
        let fechaMes = fechaActual.add(1, 'months');
        this.formularioPromo.get('fecha_fin').setValue(fechaMes.format('YYYY-MM-DD'));
        this.formularioPromo.get('fecha_inicio').setValue(fechaActual.format('YYYY-MM-DD'));
        break;
      }
  }

  cambiarSegmento(event) {
    this.segment = event.detail.value;
    if (event.detail.value == 'localidad') {
      this.formularioPromo.get('strMunicipio').setValue("");
      this.formularioPromo.get('tipoBusqueda').setValue(0);
      this.formularioPromo.get('kilometros').setValue(1);
      this.formularioPromo.get('idEstado').setValue(null);
      this.formularioPromo.get('idMunicipio').setValue(null);
      this.formularioPromo.get('idLocalidad').setValue(null);
    }
    if (event.detail.value == 'ubicacion') {
      this.formularioPromo.get('strMunicipio').setValue("");
      this.formularioPromo.get('tipoBusqueda').setValue(1);
      this.formularioPromo.get('kilometros').setValue(10);
      this.formularioPromo.get('idEstado').setValue(null);
      this.formularioPromo.get('idMunicipio').setValue(null);
      this.formularioPromo.get('idLocalidad').setValue(null);
    }
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
                  
                  this.formularioPromo.get('strMunicipio').setValue(results[0].address_components[posicion].long_name);
                } else {

                }
            } else {

                //this.loader = false;
            }
        });
  }
  
  async getCurrentPosition() {
        const gpsOptions = { maximumAge: 30000000, timeout: 2000, enableHighAccuracy: true };
        const coordinates = await Geolocation.getCurrentPosition(gpsOptions).then(res => {

          this.blnUbicacion = true;
          this.miUbicacionlatitud = res.coords.latitude;
          this.miUbicacionlongitud = res.coords.longitude;
          this.formularioPromo.get('latitud').setValue(this.miUbicacionlatitud);
          this.formularioPromo.get('longitud').setValue(this.miUbicacionlongitud);
          try {
            this.segment = 'ubicacion';
            this.formularioPromo.get('tipoBusqueda').setValue(1);
            this.geocodeLatLng();
          } catch (e) {
            
          }
        }).catch(error => {
          
          this.blnUbicacion = false;
          this.segment = 'localidad';
          this.formularioPromo.get('tipoBusqueda').setValue(0);
        }
        );
  }
  
  obtenerKilometrosRango(event) {
    this.kilometrosSlider = event.detail.value;
    this.formularioPromo.get('kilometros').setValue(this.kilometrosSlider);
  }

}
