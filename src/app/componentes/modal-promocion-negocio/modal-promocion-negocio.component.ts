import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PromocionesModel } from 'src/app/Modelos/busqueda/PromocionesModel';
import {RegistrarPromotionService} from "../../api/registrar-promotion.service";
import { UtilsCls } from '../../utils/UtilsCls';
import { PersonaService } from '../../api/persona.service';
import { PromocionesService } from '../../api/promociones.service';
import { ViewqrPromocionComponent } from '../../components/viewqr-promocion/viewqr-promocion.component';
import { ToadNotificacionService } from '../../api/toad-notificacion.service';
import  moment from 'moment';

@Component({
  selector: 'app-modal-promocion-negocio',
  templateUrl: './modal-promocion-negocio.component.html',
  styleUrls: ['./modal-promocion-negocio.component.scss'],
  providers: [UtilsCls],
})
export class ModalPromocionNegocioComponent implements OnInit {
  @Input() promocionTO: PromocionesModel;
  @Input() idPersona: number | null;
  @Input() latitud: any;
  @Input() longitud: any;

  @Input() celular:any;
  @Input() descripcion:any;
  public existeSesion: boolean;
  lstAflUsuario: unknown[];
  lstOrgUsuario: unknown[];
  listAfiliacines: any;
  existeAfl: boolean =true;
  private id_cupon_promocion: number;
  loader: boolean;
  public fechaHoy = moment();
  constructor(
    public modalController: ModalController,
    private vioPromo: RegistrarPromotionService,
    private util: UtilsCls,
    private servicioPersona: PersonaService,
    private _promociones: PromocionesService,
    private notificaciones: ToadNotificacionService
  ) { 
    this.existeSesion = this.util.existe_sesion();
  }

  ngOnInit() {

    if(this.existeSesion){
      this.obtenerOrgAfilUsuario();
    }else{
      this.loader=true;
    }
    if(this.promocionTO.id_tipo_promocion===1){
      this.loader=true;
    }
    this.calcularDias(this.promocionTO);
    this.vioPromo.registrarQuienVio(this.promocionTO.id_promocion, this.idPersona, this.latitud, this.longitud);
  }

  cerrar() {
    this.modalController.dismiss();
    this.promocionTO = new PromocionesModel();
  }

  public calcularDias(promocion: any) {
    promocion.restanDias = Math.abs(this.fechaHoy.diff(promocion.fecha_fin_public, 'days'));
}
  
  async obtenerOrgAfilUsuario(){
    const usuario_sistema = JSON.parse(localStorage.getItem("u_sistema"));
    var respuesta = await this.servicioPersona.obtenerOrgAfilUsuario(usuario_sistema.id_usuario_sistema).toPromise();

          if (respuesta.code === 200) {

            this.listAfiliacines = Object.values(respuesta.data.list_afiliaciones_usuario);
            this.lstOrgUsuario = Object.values(respuesta.data.list_organizaciones_usuario);

            this.listAfiliacines=this.listAfiliacines.concat(this.lstOrgUsuario);
            
            if(this.listAfiliacines.length>0){
              this.existeAfl =false;
              this.loader=true;

            }else{
              this.existeAfl =true;
              this.loader=true;
            }
           
              
          } 
  }

  async crearModal() {
    await  this.guardarCupon();
      const modal = await this.modalController.create({
        component: ViewqrPromocionComponent,
        componentProps: {
          'promocion': this.promocionTO,
          'idPersona': this.idPersona,
          'id_cupon_promocion': this.id_cupon_promocion
        }
      });
  
      return await modal.present();
  
  }

  async guardarCupon() {

    var respuesta = await this._promociones.solicitarCupon(this.promocionTO.id_promocion, this.idPersona).toPromise();
    if (respuesta.code === 200) {
      
      this.id_cupon_promocion = respuesta.data.id_cupon_promocion
    }
    if (respuesta.code === 402) {
      
      this.notificaciones.alerta(respuesta.message);
    }

  }
}
