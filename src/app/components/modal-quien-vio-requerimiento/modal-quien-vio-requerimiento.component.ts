import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SolicitudesService } from 'src/app/api/solicitudes.service';

@Component({
  selector: 'app-modal-quien-vio-requerimiento',
  templateUrl: './modal-quien-vio-requerimiento.component.html',
  styleUrls: ['./modal-quien-vio-requerimiento.component.scss'],
})
export class ModalQuienVioRequerimientoComponent implements OnInit {

  @Input() public solicitud;
  quienVioList: any[];
  public msj = 'Cargando';
  public loader : boolean;
  mostrarInfo: boolean;
  verInfoPersona: boolean=true;
  flagAux: any;
  nombreActivo: any;

  constructor(public modalController: ModalController,
    private solicitudesService: SolicitudesService,) { 
      this.loader = true;
    }

  ngOnInit() {
    this.obtenerQuienVioMiSolicitud()
    //console.log("Aqui recibo la solicitud: "+JSON.stringify(this.solicitud))
  }

  async obtenerQuienVioMiSolicitud(){
    await this.solicitudesService.obtenerQuienVioMiSolicitud(this.solicitud).subscribe(
      response => {
        this.quienVioList = response.data
        //console.log("Aqui obtengo lista de quien vio: "+JSON.stringify(this.quienVioList))
        this.loader = false;
      },
      error => {
      }
    );
  }
  infoVisitante(quienVio:any){
    if (!this.verInfoPersona) {
      if (this.flagAux === quienVio) {
        this.verInfoPersona = !this.verInfoPersona;
        this.nombreActivo = quienVio;
      } else {
        this.nombreActivo = quienVio;
        this.flagAux = quienVio;
      }
    }else {
      this.verInfoPersona = !this.verInfoPersona;
      this.nombreActivo = quienVio;
      this.flagAux = quienVio;
    }
  }

  cerrar() {
    this.modalController.dismiss();
  }

}
