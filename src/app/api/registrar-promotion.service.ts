import { Injectable } from '@angular/core';
import {RegistrarQuienVioMiPromocionModel} from "../Modelos/RegistrarQuienVioMiPromocionModel";
import {PromocionesService} from "./promociones.service";

@Injectable({
    providedIn: 'root'
})
export class RegistrarPromotionService {
    private quienVio: RegistrarQuienVioMiPromocionModel;

    constructor(private servicioPromotion : PromocionesService) {}

    public registrarQuienVio(idPromotion: number, idPersona: number | null, latitud: number | null, longitud: number | null) {
        this.quienVio = new RegistrarQuienVioMiPromocionModel();
        this.quienVio.id_promocion = idPromotion;
        this.quienVio.id_persona = idPersona;
        this.quienVio.latitud = latitud;
        this.quienVio.longitud = longitud;
        this.servicioPromotion.quienVioMiPromotion(this.quienVio).subscribe(
            response => {}, () => {

            }
        );
    }
}
