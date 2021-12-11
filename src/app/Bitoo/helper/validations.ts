import { ResponderModel } from "../models/responder-model";

export class ValidatorData {

    public validateSocialNetworkData(data: any) {
        return (typeof data.user.providerData[0].uid === "undefined" || data.user.providerData[0].uid === null || data.user.providerData[0].uid === "undefined");
    }

    public messageErrorValidationSocialNetworkData() {
        return 'Servicio no disponible';
    }
    public validateApple(response: ResponderModel) {
        return (response.credentials.email !== '' || response.credentials.length > 0);
    }
}
