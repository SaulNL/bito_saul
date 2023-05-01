import { ProductBusinessInterface } from '../models/product-business-model';
import { OptionSesion } from './../types/option-sesion';
import { ResponderModel } from "../models/responder-model";

export class ValidatorData {
    /**
     * @author Juan Antonio Guevara Flores
     * @param data
     * @description Valida si la información de la red social de Facebook o Google es correcta
     * @returns boolean
     */
    public validateSocialNetworkData(data: any): boolean {
        return (typeof data.user.providerData[0].uid === "undefined" || data.user.providerData[0].uid === null || data.user.providerData[0].uid === "undefined");
    }
    /**
     * @author Juan Antonio Guevara Flores
     * @description Retorna un mensaje default de error
     * @returns string
     */
    public messageErrorValidationSocialNetworkData(): string {
        return 'Servicio no disponible';
    }
    /**
     * @author Juan Antonio Guevara Flores
     * @param response
     * @description Valida si la información de las credenciales de la red social de de Apple
     * @returns boolean
     */
    public validateApple(response: ResponderModel): boolean {
        return (response.credentials.email !== '' || response.credentials.length > 0);
    }
    /**
     * @author Juan Antonio Guevara Flores
     * @param optionSesion
     * @description Valida el tipo de inicio de sesion formulario o redes sociales
     * @returns boolean
     */
    public validateOptionSesion(optionSesion: OptionSesion): boolean {
        return (optionSesion === 'defaultUser');
    }
    /**
     * @author Juan Antonio Guevara Flores
     * @description Valida si el negocio esta abierto y tiene alguno metodo de envio activo y su precio no es cero
     * @param business
     * @param price
     * @returns boolean
     */
    public purchase(business: ProductBusinessInterface, price: number): boolean {
        return ((
            business.consumptionOnSite ||
            business.deliveryOnSite ||
            business.homeDelivery
        ) &&
            price > 0 && business.isOpen);
    }
    /**
     * @author Juan Antonio Guevara Flores
     * @description Valida si existe el precio
     * @param price
     * @returns boolean
     */
    public existPrice(price: number): boolean {
        return (price > 0);
    }
    /**
     * @author Juan Antonio Guevara Flores
     * @description Valida si 2 objetos son iguales
     * @param source
     * @param target
     * @returns
     */
    public validateObj(source: any, target: any): boolean {
        return JSON.stringify(source) === JSON.stringify(target);
    }
    /**
     * @author Juan Antonio Guevara Flores
     * @description Valida si existe el token
     * @returns boolean
     */
    public isTokenExist(): boolean {
        const token: string = localStorage.getItem('nftoken');
        if (token === null) {
            return false;
        }
        return true;
    }
    /**
     * @author Juan Antonio Guevara Flores
     * @description valida si existe una sesión iniciada
     * @returns boolean
     */
    public isSessionExist(): boolean {
        const token = localStorage.getItem("tk_str");
        if (token !== null && token !== undefined) {
            return true;
        }
        return false;
    }
    /**
     * @author Juan Antonio Guevara Flores
     * @description valida si se activa la actualización de token para las notificaciones
     * @returns boolean
     */
    public activeNotification(): boolean {
        return (this.isSessionExist() && this.isTokenExist());
    }
}
