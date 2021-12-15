import { SelectedSocialNetwork } from './../types/platform-type';
import { ResponderModel } from './../models/responder-model';
export class ResponseCommon {
    /**
     * @author Juan Antonio Guevara Flores
     * @param response
     * @returns boolea
     * @description Valida si la respuesta del Responder
     */
    public validation(response: ResponderModel): boolean {
        return (response.isSuccess === 'success');
    }
    /**
     * @author Juan Antonio Guevara Flores
     * @param response
     * @description Retorna un mensaje de error predeterminado paras la red social
     * @returns string
     */
    public errorMessage(response: ResponderModel): string {
        return this.message(response.socialNetwork);
    }
    /**
     * @author Juan Antonio Guevara Flores
     * @param platform
     * @description Retorna el mensaje de error creado para la diferente red social
     * @returns string
     */
    private message(platform: SelectedSocialNetwork): string {
        const text: string = this.textToUpperCase(platform);
        return 'Se perdió la conexión con el servidor de ' + text;
    }
    /**
     * @author Juan Antonio Guevara Flores
     * @param text
     * @description Retorna una palabra convertida su primera letra em mayuscula
     * @returns string
     */
    public textToUpperCase(text: string) {
        return text.charAt(0).toUpperCase() + text.slice(1);
    }

}
