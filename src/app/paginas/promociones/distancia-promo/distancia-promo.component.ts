import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { async } from 'rxjs/internal/scheduler/async';
import { UbicacionMapa } from 'src/app/api/ubicacion-mapa.service';
import { ModalPromocionComponent } from 'src/app/components/modal-promocion/modal-promocion.component';

@Component({
  selector: 'app-distancia-promo',
  templateUrl: './distancia-promo.component.html',
  styleUrls: ['./distancia-promo.component.scss'],
})
export class DistanciaPromoComponent implements OnInit {

  @Input() promociones: any;
  @Input() ubicacionActual: any;
  @Input() mostrarLogueo: any;
  @Input() idPersona: number | null;
  @Output() banderaAlert: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() loader: EventEmitter<boolean> = new EventEmitter<boolean>();

  public promocionesDistancia: any;
  public promoOrdenada
  listaDias: any;

  constructor(
    public getCoordinatesMap: UbicacionMapa,
    public modalController: ModalController
  ) { 
    this.promocionesDistancia = [];
  }

  ngOnInit() {
    let origen: any;
    let destino: any;
    origen = this.ubicacionActual.lat + ',' + this.ubicacionActual.long;
    this.promociones.forEach(async(element) => {
      element.promociones.forEach(async (element) => {
        destino = element.latitud + ',' + element.longitud;
        var responseDistKm = await this.getCoordinatesMap.getDistanciaKmTiempo(origen, destino).toPromise();
        element.distancia = responseDistKm.status == "OK" ? parseInt(responseDistKm.routes[0].legs[0].distance.text) : 1000;
        this.promocionesDistancia.push(element)
      });

    });
    setTimeout(() => {
      this.ordenarPorDistancia()
    }, 2000);
  }

  ordenarPromo() {
    
  }

  async ordenarPorDistancia() {
    this.promoOrdenada = await this.promocionesDistancia.sort(function(a, b) {
  // Comparar por alguna propiedad, como el "id"
    return a.distancia - b.distancia;
  } );
  }
  
  compararDistancia(a, b): number {
  const distanciaA = parseFloat(a.distancia.replace(' km', ''));
  const distanciaB = parseFloat(b.distancia.replace(' km', ''));

  if (distanciaA < distanciaB) {
    return -1;
  } else if (distanciaA > distanciaB) {
    return 1;
  } else {
    return 0;
  }
  }
  
  modal(promo) {
    this.loader.emit(true)
    if (!this.mostrarLogueo) {
      this.abrirModal();
    } else {
      this.arreglarHorarios(promo.dias)
      setTimeout(()=>{
        this.crearModal(promo);
      }, 1000);
    }
  }

  arreglarHorarios(dias) {
    this.listaDias = [];
    let arrayDias = dias.map(e => {
      e.arrayDias = e.dias.toString().split(',').filter(dia => dia != "");
      return e;
    })

    arrayDias.forEach(f =>{
      let json = null;
      let ultimoDia = f.arrayDias[f.arrayDias.length - 1];
      let penultimoDia = f.arrayDias[f.arrayDias.length - 2];
      let indexUltimoDia = f.arrayDias.indexOf(ultimoDia);
      let indexPenultimoDia = f.arrayDias.indexOf(penultimoDia);

      json = { id_horario: f.id_horario_promocion, hora_inicio: f.hora_inicio, hora_fin: f.hora_fin, dias: [] };

      f.arrayDias.forEach((dia, index) => {
        if (indexUltimoDia != index && indexPenultimoDia != index) {
          dia = dia.concat(', ');
          json.dias.push(dia);
        }else{
          json.dias.push(dia);
        }
      });

      // Se agrega la letra 'y' al arreglo antes del ultimo dia, pero si solo hay un dato no se agrega.
      if (json.dias.length > 1) json.dias.splice(indexUltimoDia, 0, ' y ');

      this.listaDias.push(json);
    });
  }

  abrirModal(){
    const isAlert = true;
    this.banderaAlert.emit(isAlert);
  }

  async crearModal(promo) {
    const modal = await this.modalController.create({
      component: ModalPromocionComponent,
      componentProps: {
        'promocion': promo,
        'idPersona': this.idPersona,
        'listaDias': this.listaDias
      }
    });
    modal.onDidDismiss()
      .then((data) => {
      const user = data['data'];
  });
    return await modal.present();
  }
}
