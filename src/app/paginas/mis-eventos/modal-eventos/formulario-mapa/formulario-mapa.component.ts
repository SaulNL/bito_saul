import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GeneralServicesService } from 'src/app/api/general-services.service';
import { Map, tileLayer, marker, Marker, icon, latLng } from 'leaflet';
import * as L from 'leaflet';
import { UbicacionMapa } from 'src/app/api/ubicacion-mapa.service';
import { ToadNotificacionService } from 'src/app/api/toad-notificacion.service';

@Component({
  selector: 'app-formulario-mapa',
  templateUrl: './formulario-mapa.component.html',
  styleUrls: ['./formulario-mapa.component.scss'],
})
export class FormularioMapaComponent implements OnInit {
  @Input() datosEvento: any;
  @Input() estado: any;
  @Input() municipio: any;
  @Input() localidad: any;
  @Input() recurrencia: any;
  @Output() enviarDatosMapa = new EventEmitter<string>();

  //Latitud: 19.316935492666076, Longitud: 261.76180609661117 datos de tlaxcala

  map: Map;
  public formularioMapa: FormGroup;
  public frecuenciaSemanal: boolean = false;
  public vistaFecha: string;
  public vistaDias: string;

  constructor(
    private formBuilder: FormBuilder,
    private generalService: GeneralServicesService,
    private getCoordinatesMap: UbicacionMapa,
    private notificacion: ToadNotificacionService,
  ) { 
    this.formularioMapa = formBuilder.group({
      frecuencia: ['', [Validators.required]],
      fecha: new FormControl(new Date()),
      dias: [''],
      tipoEvento: ['', [Validators.maxLength(50)]],
      estado: ['', [Validators.required]],
      municipio: ['', [Validators.required]],
      localidad: ['', [Validators.required]],
      colonia: ['', [Validators.required]],
      calle: ['', [Validators.required]],
      numExterior: ['', [Validators.required]],
      numInterior: [''],
      cP: ['', [Validators.required]],
      lt: [''],
      long: [''],
    })
  }

  ngOnInit() {
    if (this.datosEvento) {
      this.asgnarValores()
    }
    let lat = this.datosEvento && this.datosEvento.latitud ? this.datosEvento.latitud : 19.316935492666076;
    let long = this.datosEvento && this.datosEvento.longitud ? this.datosEvento.longitud : 261.76180609661117;
    this.initializeMap(lat, long);
  }
  
  initializeMap(lat,lng) {
    setTimeout(() => {
      this.map = new Map("formularioMapa").setView([lat, lng],14 );
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '' }).addTo(this.map);
      L.marker([lat, lng]).addTo(this.map);
    }, 1000);

  }
  
  asgnarValores() {
    this.formularioMapa.get('frecuencia').setValue(this.datosEvento.id_tipo_recurrencia)
    this.frecuenciaSemanal = this.datosEvento.id_tipo_recurrencia == 3 ? true : false;
    this.vistaDias = this.datosEvento.id_tipo_recurrencia == 3 ? 'initial' : 'none';
    this.vistaFecha = this.datosEvento.id_tipo_recurrencia == 1 ? 'initial' : 'none';
    this.formularioMapa.get('fecha').setValue(this.datosEvento.fecha)
    this.formularioMapa.get('dias').setValue(JSON.parse(this.datosEvento.dias))
    this.formularioMapa.get('tipoEvento').setValue(this.datosEvento.tipo_evento)
    this.formularioMapa.get('estado').setValue(this.datosEvento.id_estado)
    this.formularioMapa.get('municipio').setValue(this.datosEvento.id_municipio)
    this.formularioMapa.get('localidad').setValue(this.datosEvento.id_localidad)
    this.formularioMapa.get('colonia').setValue(this.datosEvento.colonia)
    this.formularioMapa.get('calle').setValue(this.datosEvento.calle)
    this.formularioMapa.get('numExterior').setValue(this.datosEvento.numero_ext)
    this.formularioMapa.get('numInterior').setValue(this.datosEvento.numero_int)
    this.formularioMapa.get('cP').setValue(this.datosEvento.codigo_postal)
  }
  
  buscarMapa() {
    let addres = `${this.formularioMapa.get('calle').value} ${this.formularioMapa.get('numExterior').value},${this.formularioMapa.get('colonia').value},${this.formularioMapa.get('cP').value} ${this.formularioMapa.get('municipio').value},${this.formularioMapa.get('estado').value}`
    this.obtenerCordenadas(addres);
  }

  obtenerMunicipio(idMuni) {
    this.generalService.getMunicipiosAll(idMuni.detail.value).subscribe(res => {
      this.municipio = res.data.list_cat_municipio;
    }),error => {
          console.log(error)
    }
    this.enviarInformacion();
  }

  obtenerLocalidad(idLoc) {
    this.generalService.getLocalidadAll(idLoc.detail.value).subscribe(response => {
          this.localidad = response.data.list_cat_localidad;
      },
        error => {
          console.log(error)
        },
        () => {
          //  this.loaderLocalidad = false;
        }
    );
    this.enviarInformacion();
  }

  enviarInformacion() {
    this.enviarDatosMapa.emit(this.formularioMapa.value)
  }

  lugarMapa() {
    this.eliminarMarcador();

    this.map.on('click', (e) => {
      const latitud = e.latlng.lat;
      const longitud = e.latlng.lng;

      L.marker([latitud, longitud]).addTo(this.map);
      this.formularioMapa.get('lt').setValue(latitud)
      this.formularioMapa.get('long').setValue(longitud)
      this.enviarInformacion()
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
        this.formularioMapa.get('lt').setValue(lat)
        this.formularioMapa.get('long').setValue(long)
        this.enviarInformacion()
        } else {
          this.notificacion.error('No se encontró la ubicación')
        }
        
      });
  }

  tipoFrecuencia(tipo) {
    this.frecuenciaSemanal = tipo.detail.value == 1 ? false : true;
    this.vistaDias = tipo.detail.value == 3 ? 'initial' : 'none';
    this.vistaFecha = tipo.detail.value == 1 ? 'initial' : 'none';
    let fechas = tipo.detail.value == 1 ? this.formularioMapa.get('fecha').value : null;
    let dias = tipo.detail.value == 3 ? this.formularioMapa.get('dias').value : null;
    this.formularioMapa.get('fecha').setValue(fechas)
    this.formularioMapa.get('dias').setValue (dias)
    this.enviarInformacion();
  }

  selectFechaEvento(event: any) {
    let fecha = event.detail.value;
    let ms = Date.parse(fecha);
    fecha = new Date(ms).toISOString();
    this.formularioMapa.get('fecha').setValue(fecha);
    this.enviarInformacion()
  }

}
