import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { FiltrosService } from 'src/app/api/filtros.service';
import { GeneralServicesService } from 'src/app/api/general-services.service';
import { PromocionesService } from 'src/app/api/promociones.service';

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

  formularioPromo: FormGroup;
  public lstEstados: any;
  public listCatMunicipio: any;
  public listCaLocalidad: any;
  public listPlazas: any;
  public lstPromociones: any;

  constructor(
    private formBuilder: FormBuilder,
    private filtroServicio: FiltrosService,
    private generalService: GeneralServicesService,
    private _promociones: PromocionesService,
    private modalController: ModalController
  ) { 
    this.obtenerPlazas();
    this.obtenerCatEstados();
    this.formularioPromo = this.formBuilder.group({
      abierto: [null],
      blnEntrega: [null],
      idCategoriaNegocio: [[null]],
      idDistintivo: [null],
      idEstado: [29],
      idMunicipio: [null],
      idLocalidad: [null],
      idTipoNegocio: [null],
      id_persona: [null],
      intEstado: [0],
      kilometros: [1],
      latitud: [19.33836768406867],
      limpiarF: [false],
      longitud: [-98.18386544575286],
      organizacion: [null],
      strBuscar: [''],
      strMunicipio: [''],
      tipoBusqueda: [0],
      typeGetOption: [true],
    });
  }

  ngOnInit() { }
  
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
  
  public obtenerCatMunicipio() {
    console.log('obtenerMun',this.formularioPromo.get('idEstado').value)
        this.filtroServicio.obtenerMunicipios(this.formularioPromo.get('idEstado').value).subscribe(
            response => {
            this.listCatMunicipio = response.data.list_cat_municipio;
            console.log('Municipio',this.listCatMunicipio)
            },
            () => {
            }
        );
  }
  
  public obtenerCatLocalidad() {
    console.log('obtenerLoc',this.formularioPromo.get('idMunicipio').value)
        this.filtroServicio.getLocalidad(this.formularioPromo.get('idMunicipio').value).subscribe(
            response => {
            this.listCaLocalidad = response.data.list_cat_localidad;
            console.log('Municipio',this.listCaLocalidad)
            },
            () => {

            }
        );
  }
  
  obtenerPlazas() {
    this.generalService.obtenerPlazas().subscribe(
      response => {
        if (response.code === 200 && response.data.length > 0) {
          this.listPlazas = response.data;
          console.log('plazas',this.listPlazas)
        }
      }, error => {
        console.log(error)
      }
    );
  }

  buscarFiltros() {
    let filtro = {
      filtros:this.formularioPromo.value
    }
    console.log('guardarFiltros', filtro)
    this._promociones.buscarPromocinesPublicadasModulo(this.formularioPromo.value).subscribe( (response) => {
      console.log('promocionesEncontradas',response)
      if (response.code === 402) {
      }
      if (response.data !== null) {
        this.lstPromociones = response.data;
        this.lstPromocionesFiltro.emit(this.lstPromociones)
        this.modalController.dismiss();
      } else {
        this.lstPromociones = [];
        this.lstPromocionesFiltro.emit(this.lstPromociones)
        this.modalController.dismiss();
      }
    }, () => {
      this.lstPromociones = [];
    },() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  abiertoCerrado() {
    console.log('enrteAbierto')
    let abierto = this.formularioPromo.get('abierto').value == undefined ? null : this.formularioPromo.get('abierto').value;
    this.formularioPromo.get('abierto').setValue(abierto)
  }

  limpiarFiltro() {
    this.formularioPromo.reset();
    this.buscarFiltros();
  }

}
