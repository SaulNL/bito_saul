import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { icon, Map, Marker, marker, tileLayer } from 'leaflet';

@Component({
  selector: 'app-mapa-perfil',
  templateUrl: './mapa-perfil.component.html',
  styleUrls: ['./mapa-perfil.component.scss'],
})
export class MapaPerfilComponent implements OnInit {
  @Input() latitudNeg;
  @Input() longitudNeg;
  @ViewChild('mapContainerNuevo') mapContainer: Map;
  private map: Map;
  private marker: Marker<any>;
  public miLat: any;
  public miLng: any;

  constructor() {
    this.miLat = null;
    this.miLng = null
  }

  ngOnInit() {
    this.loadMap()
  }

  async loadMap() {
    const lat = this.latitudNeg;
    const lng = this.longitudNeg;
    setTimeout((it) => {
      this.map = new Map('mapIdPedido').setView([lat, lng], 14);
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '',
      }).addTo(this.map);
      this.map.on('', (respuesta) => {
        this.getLatLong(respuesta);
      });
      const myIcon = icon({
        iconUrl:
          'https://ecoevents.blob.core.windows.net/comprandoando/marker.png',
        iconSize: [45, 41],
        iconAnchor: [13, 41],
      });
      this.marker = marker([lat, lng], { icon: myIcon, draggable: false }).addTo(
        this.map
      );
    }, 1000);
    // console.log("Esta es la info que carga el mapa:\n"+"lat: "+lat+" long: "+lng)
  }

  getLatLong(e) {
    this.miLat = e.latlng.lat;
    this.miLng = e.latlng.lng;
    this.map.panTo([this.miLat, this.miLng]);
    this.marker.setLatLng([this.miLat, this.miLng]);
  }

}
