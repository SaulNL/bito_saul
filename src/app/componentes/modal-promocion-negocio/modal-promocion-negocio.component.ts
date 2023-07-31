import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PromocionesModel } from 'src/app/Modelos/PromocionesModel';
import { UtilsCls } from '../../utils/UtilsCls';
import { PromocionesService } from '../../api/promociones.service';

@Component({
  selector: 'app-modal-promocion-negocio',
  templateUrl: './modal-promocion-negocio.component.html',
  styleUrls: ['./modal-promocion-negocio.component.scss'],
  providers: [UtilsCls],
})
export class ModalPromocionNegocioComponent implements OnInit, AfterViewInit {
  @Input() promocionTO: any;
  @Input() idPersona: number | null;
  @Input() latitud: any;
  @Input() longitud: any;

  @Input() celular: any;
  @Input() descripcion: any;

  constructor(
    public modalController: ModalController,
    private _promociones: PromocionesService,
  ) {}

  ngAfterViewInit(): void {}

  ngOnInit() {
    this.pasarParametros();
  }

  pasarParametros(){
    this._promociones.setPromocionObj(this.promocionTO);
    this._promociones.setIdPersonaObj(this.idPersona);
    this._promociones.setListaDiasObj(this.descripcion);
    this._promociones.setLatitudObj(this.latitud);
    this._promociones.setLongitudObj(this.longitud);
    this._promociones.setCelularObj(this.celular);
  }

  cerrar() {
    this.modalController.dismiss();
    this.promocionTO = new PromocionesModel();
    //this.router.navigateByUrl("/tabs/promociones");
  }

}
