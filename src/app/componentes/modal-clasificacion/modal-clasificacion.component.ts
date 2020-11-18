import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { ToadNotificacionService } from '../../api/toad-notificacion.service';
import { NegocioService } from '../../api/negocio.service';

@Component({
  selector: 'app-modal-clasificacion',
  templateUrl: './modal-clasificacion.component.html',
  styleUrls: ['./modal-clasificacion.component.scss'],
})
export class ModalClasificacionComponent implements OnInit {

  @Input() public modalEditarCat: any;
  @Input() public datosNegocio: any;
  @Input() public listaVista: any;
  public nombreActual: string;
  public banderaGuardar: boolean;

  constructor(
    public modalController: ModalController,
    public notificacionService: ToadNotificacionService,
    private sercicioNegocio: NegocioService
  ) { }

  ngOnInit() {
    this.nombreActual = this.modalEditarCat.nombre;
  }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  public guardar(form: NgForm) {
    if ( form.invalid ) {
      return Object.values( form.controls ).forEach( control => {
        if (control instanceof FormGroup ) {
          Object.values( control.controls ).forEach( con => con.markAsTouched());
        } else {
          control.markAsTouched();
        }
      });
    }else {
      if (this.modalEditarCat.nombre === undefined) {
        this.notificacionService.error('El nombre de la categoría es requerido');
        return;
      }
      this.modalEditarCat.id_proveedor = this.datosNegocio.idProveedor;
      this.modalEditarCat.id_negocio = this.datosNegocio.id_negocio;
      console.log(this.modalEditarCat);

      this.sercicioNegocio.modificarCategoria(this.modalEditarCat).subscribe(
        repsuesta => {
          console.log(repsuesta);
          const categoriaMod = this.listaVista.find(cat => cat.id_categoria === this.modalEditarCat.id_categoria);
          categoriaMod.nombre = this.modalEditarCat.nombre;
          categoriaMod.activo = this.modalEditarCat.activo;
          if (repsuesta.code === 402) {
            this.notificacionService.alerta(repsuesta.message);
          }
          if (!this.modalEditarCat.activo) {
            if (categoriaMod.productos !== undefined && categoriaMod.productos !== null) {
              categoriaMod.productos.forEach(prod => {
                prod.existencia = false;
              });
            }
          }
  
          this.notificacionService.exito('Se actualizó la categoría con éxito');
          this.dismiss();
        },
        error => {
          this.notificacionService.error('Ocurrio un error al actualizar la categoría, intenta más tarde');
        }, () => {
          this.banderaGuardar = false;
        }
      );

    }
  }

}