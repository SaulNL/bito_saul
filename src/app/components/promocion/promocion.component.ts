import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ModalPromocionComponent } from '../modal-promocion/modal-promocion.component';
import { PromocionesModel } from '../../Modelos/PromocionesModel';

@Component({
  selector: 'app-promocion',
  templateUrl: './promocion.component.html',
  styleUrls: ['./promocion.component.scss'],
})
export class PromocionComponent implements OnInit {

  @Input() promocion: PromocionesModel;
  @Input() idPersona: number | null;
  @Input() mostrarLogueo: any;
  @Output() banderaAlert: EventEmitter<boolean> = new EventEmitter<boolean>();
  idPromo: number;
  loader: boolean=true;
  listaDias: any;

  constructor( public modalController: ModalController ) {
  }

  ngOnInit() {
  }


  modal(){
    if (!this.mostrarLogueo) {
      this.abrirModal();
    } else {
      this.loader = false;
      this.idPromo =this.promocion.id_promocion;
      this.arreglarHorarios(this.promocion.dias)
      setTimeout(()=>{
        this.crearModal();
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

  async crearModal( ){
    const modal = await this.modalController.create({
      component: ModalPromocionComponent,
      componentProps: {
        'promocion': this.promocion,
        'idPersona': this.idPersona,
        'listaDias': this.listaDias
      }
    });
    modal.onDidDismiss()
    .then((data) => {
      const user = data['data'];
      this.loader=true;
  });
    return await modal.present();
  }

  abrirModal(){
    const isAlert = true;
    this.banderaAlert.emit(isAlert);
  }

}
