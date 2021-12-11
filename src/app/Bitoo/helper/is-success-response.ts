import { SelectedSocialNetwork } from './../types/platform-type';
import { ResponderModel } from './../models/responder-model';
export class ResponseCommon {

    public validation(response: ResponderModel): boolean {
        return (response.isSuccess === 'success');
    }

    public errorMessage(response: ResponderModel) {
        return this.message(response.socialNetwork);
    }

    private message(platform: SelectedSocialNetwork) {
        const text: string = this.textToUpperCase(platform);
        return 'Se perdió la conexión con el servidor de ' + text;
    }

    private textToUpperCase(text: string) {
        return text.charAt(0).toUpperCase() + text.slice(1);
    }

}
