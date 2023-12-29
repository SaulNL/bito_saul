import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GeneralServicesService } from 'src/app/api/general-services.service';
import { ToadNotificacionService } from 'src/app/api/toad-notificacion.service';
import { UbicacionMapa } from 'src/app/api/ubicacion-mapa.service';
import { UtilsCls } from 'src/app/utils/UtilsCls';
import { Map, tileLayer, marker, Marker, icon, latLng } from 'leaflet';
import * as L from 'leaflet';

@Component({
  selector: 'app-ubicacion-formulario',
  templateUrl: './ubicacion-formulario.component.html',
  styleUrls: ['./ubicacion-formulario.component.scss'],
})
export class UbicacionFormularioComponent implements OnInit {
  @Input() datosUbicacion: any;
  @Output() enviarUbicacion = new EventEmitter<string>();
  
  map: Map;
  ubicacionForm: FormGroup;
  
  public list_cat_estado: any;
  public municipio: any;
  public localidad: any;

  constructor(
    private generalService: GeneralServicesService,
    private _utils_cls: UtilsCls,
    private _notificacionService: ToadNotificacionService,
    private formBuilder: FormBuilder,
    private getCoordinatesMap: UbicacionMapa,
  ) {
    this.ubicacionForm = this.formBuilder.group({
      id_estado: ['',Validators.required],
      id_municipio: ['',Validators.required],
      id_localidad: ['',Validators.required],
      calle: ['',Validators.required],
      numero_ext: ['',Validators.required],
      numero_int: [''],
      colonia: ['',Validators.required],
      codigo_postal: ['',Validators.required],
      latitud: ['',Validators.required],
      longitud: ['',Validators.required],
    });
    }

  ngOnInit() { 
    this.obtenerEstados();
    let lat = this.datosUbicacion && this.datosUbicacion.latitud ? this.datosUbicacion.latitud : 19.316935492666076;
    let long = this.datosUbicacion && this.datosUbicacion.longitud ? this.datosUbicacion.longitud : 261.76180609661117;
    console.log(this.datosUbicacion)
    if (this.datosUbicacion) {
      this.asgnarValores(lat,long)
    }
    this.initializeMap(lat, long);
  }
  asgnarValores(lat, long) {
    this.ubicacionForm.get('id_estado').setValue(this.datosUbicacion.id_estado)
    this.ubicacionForm.get('id_municipio').setValue(this.datosUbicacion.id_municipio)
    this.ubicacionForm.get('id_localidad').setValue(this.datosUbicacion.id_localidad)
    this.ubicacionForm.get('colonia').setValue(this.datosUbicacion.colonia)
    this.ubicacionForm.get('calle').setValue(this.datosUbicacion.calle)
    this.ubicacionForm.get('numero_ext').setValue(this.datosUbicacion.numero_ext)
    this.ubicacionForm.get('numero_int').setValue(this.datosUbicacion.numero_int)
    this.ubicacionForm.get('codigo_postal').setValue(this.datosUbicacion.codigo_postal)
    this.ubicacionForm.get('latitud').setValue(lat)
    this.ubicacionForm.get('longitud').setValue(long)
  }
  
  obtenerEstados() {
    console.log('entre')
    this.generalService.getEstadosWS().subscribe(async response => {
      if (this._utils_cls.is_success_response(response.code)) {
        this.list_cat_estado = await response.data.list_cat_estado;
        if (this.datosUbicacion) {
          this.obtenerMunicipio(this.datosUbicacion.id_estado);
        }
        // this.loader = false;
      }
    },
      error => {
        this._notificacionService.error(error);
      }
    );
  }

  obtenerMunicipio(idMuni) {
    let municipio 
    try {
      municipio= !idMuni.detail.value ? idMuni : idMuni.detail.value
    } catch (error) {
      municipio = idMuni
    }
    this.generalService.getMunicipiosAll(municipio).subscribe(async res => {
      this.municipio = await res.data.list_cat_municipio;
      if (this.datosUbicacion) {
        this.obtenerLocalidad(this.datosUbicacion.id_municipio);
      }
    }),error => {
          console.log(error)
    }
    this.enviarInformacion();
  }

  obtenerLocalidad(idLoc) {
    let loc 
    try {
      loc = !idLoc.detail.value ? idLoc : idLoc.detail.value
    } catch (error) {
      loc = idLoc      
    }
    console.log(idLoc)
    this.generalService.getLocalidadAll(loc).subscribe(async response => {
          this.localidad = await response.data.list_cat_localidad;
      },
        error => {
          console.log(error)
        },
        () => {
        }
    );
    this.enviarInformacion();
  }

  enviarInformacion() {
      this.enviarUbicacion.emit(this.ubicacionForm.value)
  }

  buscarMapa() {
    let addres = `${this.ubicacionForm.get('calle').value} ${this.ubicacionForm.get('numero_ext').value},${this.ubicacionForm.get('colonia').value},${this.ubicacionForm.get('codigo_postal').value} ${this.ubicacionForm.get('id_municipio').value},${this.ubicacionForm.get('id_estado').value}`
    this.obtenerCordenadas(addres);
  }

  obtenerCordenadas(address) {
    this.getCoordinatesMap.getPosts(address)
    .then(async data => {
      const arrayPosts: any = data;
      if (arrayPosts.results.length > 0) {
          this.eliminarMarcador();
          let lat = await arrayPosts.results[0].geometry.location.lat;
        let long = await arrayPosts.results[0].geometry.location.lng;
        this.map.setView([lat, long], 14);
        let marker = L.marker([lat, long]).addTo(this.map);
        marker.bindPopup("<b>Esta es</b><br>tu ubicacion?").openPopup();
        this.ubicacionForm.get('latitud').setValue(lat)
        this.ubicacionForm.get('longitud').setValue(long)
        this.enviarInformacion()
        } else {
          this._notificacionService.error('No se encontró la ubicación')
        }
        
      });
  }

  eliminarMarcador() {
    const hayMarcador = this.map.getPane('markerPane');
    if (hayMarcador && hayMarcador.children.length > 0) {
      this.map.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          this.map.removeLayer(layer);
        }
      });
      }
  }

  initializeMap(lat,lng) {
    setTimeout(() => {
      this.map = new Map("formularioUbicacionMapa").setView([lat, lng],14 );
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '' }).addTo(this.map);
      L.marker([lat, lng]).addTo(this.map);
    }, 1000);

  }

}
