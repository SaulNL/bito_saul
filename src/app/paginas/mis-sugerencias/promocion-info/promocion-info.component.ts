import {ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { HaversineService, GeoCoord } from "ng2-haversine"
import { PromocionesService } from '../../../api/promociones.service';
import {Auth0Service} from "../../../api/auth0.service";


@Component({
  selector: 'app-promocion-info',
  templateUrl: './promocion-info.component.html',
  styleUrls: ['./promocion-info.component.scss'],
  providers: [Auth0Service]
})
export class PromocionInfoComponent implements OnInit {

  @ViewChild('qrcode', { static: false }) qrcode: ElementRef;
  @Input() promocion: any;
  @Input() idPersona: number | null;
  @Input() listaDias: any[];

  constructor(
    public modalController: ModalController,
    private router: Router,
    private _promociones: PromocionesService,
    private _haversineService: HaversineService,
  ) { }

  ngOnInit() {
    this.pasarParametros();
  }

  pasarParametros(){
    this._promociones.setPromocionObj(this.promocion);
    this._promociones.setIdPersonaObj(this.idPersona);
    this._promociones.setListaDiasObj(this.listaDias);
  }

  dismissModal() {
    this.modalController.dismiss();
  }
}
