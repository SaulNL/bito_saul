import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { QuienVioModel } from '../../Modelos/QuienVioModel';
import {PromocionesService} from "../../api/promociones.service";
import {ToadNotificacionService} from "../../api/toad-notificacion.service";
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-modal-info-promo',
  templateUrl: './modal-info-promo.component.html',
  styleUrls: ['./modal-info-promo.component.scss'],
})
export class ModalInfoPromoComponent implements OnInit {

  @Input() public lstQuienVioPublicacion: any;
  @Input() public id: any;
  @Input() public lstPromocionesSolicitadas: any;
  @Input() public lstQuienVioPublicacionActiva: boolean;
  @Input() public btnLoaderModal: boolean;
  @Input() public numeroVisto: number;


  public trueFormControl = new FormControl(false);
  public falseFormControl = new FormControl(false);

  constructor( 
    public modalController: ModalController, 
    private _promociones_service: PromocionesService,
    public _notificacionService: ToadNotificacionService) { }

  ngOnInit() {
  }

  dismiss() {
    this.modalController.dismiss({
      'dismissed': true,
    });
  }

    listaPromocionesSolicitadas(id_promocion){
      this.btnLoaderModal = true;
      console.log(id_promocion);
      this._promociones_service.obtenerListaPromocionesSolicitadas(id_promocion).subscribe(
          (response) => {
              this.lstPromocionesSolicitadas = response.data;
          },
          (error) => {
          }
      );
      
    }
  
    quienVioPublicacion(id_promocion) {
      this.btnLoaderModal = true;

      this._promociones_service.obtenerQuienVioPublicacion(id_promocion).subscribe(
              (response) => {
                  this.lstQuienVioPublicacion = response.data;
                  this.quienNumeroVioPublicacion(id_promocion);
              },
              (error) => {
              }
          );
     }

     quienNumeroVioPublicacion(id_promocion) {
      this._promociones_service
          .obtenerNumeroQuienVioPublicacion(id_promocion)
          .subscribe(
              (response) => {
                  this.numeroVisto = response.data;
                  this.btnLoaderModal = false;
                  //this.infoPromocion();
              },
              (error) => {
              }
          );
    }

  dejar(id_cupon_promocion: number,estatus:number ){
    let cupon = {
      "id_cupon_promocion": id_cupon_promocion,
      "id_estatus_cupon": estatus,
      "id_persona_aplica": "",
      "fc_aplicacion": "",
    };
    this._promociones_service.CambiarEstatusCupon(cupon).subscribe(

          (response) => {

              if (response.data === true) {
                  
                   this._notificacionService.exito("Se cambio el estatus del cupón correctamente");
                   this.listaPromocionesSolicitadas(this.id);
                   this.quienNumeroVioPublicacion(this.id);              
              }
              if (response.data === false) {
                  this._notificacionService.error(response.data.mensaje);
              }
          },
          (error) => {
              this._notificacionService.error(error);
              
          }
      );
  }
    
}
