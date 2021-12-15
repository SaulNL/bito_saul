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
}
