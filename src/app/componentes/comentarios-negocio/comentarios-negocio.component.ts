import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {NegocioService} from '../../api/negocio.service';

@Component({
  selector: 'app-comentarios-negocio',
  templateUrl: './comentarios-negocio.component.html',
  styleUrls: ['./comentarios-negocio.component.scss'],
})
export class ComentariosNegocioComponent implements OnInit {
  @Input() public idNegocio: any;
  public listaComentarios: [];
  public mostrarComentarios: boolean;

  constructor(
      private modalController: ModalController,
      private negocioService: NegocioService,
  ) { }

  ngOnInit() {
    this.comentariosNegocio();
  }

  cerrarModal() {
    this.modalController.dismiss();
  }

  comentariosNegocio(){
    this.negocioService.obtenerComentariosNegocio(this.idNegocio).subscribe(
        response => {
          if (response.data !== null) {
            this.listaComentarios = response.data;
            if (this.listaComentarios.length > 0){
              this.mostrarComentarios = true;
              let i = 0;
              for (let comentario of this.listaComentarios){
                this.valorEstrellas(comentario, i);
                i++;
              }

            }
          }
        },
        error => {
          
        }
    );
  }

  valorEstrellas(comentario, index) {
    setTimeout((it) => {
      let numeroEstrella = comentario.calificacion.toString();
      let estrellas = <any> document.getElementsByName("estrellas" + index);
      for (let i = 0; i < estrellas.length; i++) {
        if (estrellas[i].value === numeroEstrella) {
          let estrellaValor = estrellas[i];
          estrellaValor.setAttribute("checked", true);
        }
      }
    }, 500);
  }

}
