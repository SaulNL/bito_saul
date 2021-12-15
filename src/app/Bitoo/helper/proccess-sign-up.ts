import { UserSignInInterface, UserSignInModel } from './../models/user-sign-in';
import { SelectedSocialNetwork } from './../types/platform-type';
import { CommonUserSignUpInterface, CommonUserSingUpModel, ContentCommonUserSingUpModel } from './../models/user-sign-up-model';
import { ResponderModel, ResponderInterface } from './../models/responder-model';
export class ProccessSignUp {
    /**
     * @author Juan Antonio Guevara Flores
     * @param response
     * @description Crear el Model para Iniciar sesión con Facebook o Google
     * @returns ContentCommonUserSingUpModel
     */
    public proccessCreateAccountModel(response: ResponderModel): ContentCommonUserSingUpModel {
        const content = response.credentials;
        const credentials = content.user;
        const password = credentials.providerData[0].uid;
        const photo: string = this.getPictureProfile(response);
        const user: CommonUserSignUpInterface = new CommonUserSingUpModel(credentials.providerData[0].displayName,
            credentials.providerData[0].email, photo, password);
        return new ContentCommonUserSingUpModel(password, user);
    }
    /**
     * @author Juan Antonio Guevara Flores
     * @param response
     * @description Obtener la imagen de perfil Para Facebook o Google
     * @returns string
     */
    private getPictureProfile(response: ResponderModel): string {
        return (response.socialNetwork === 'facebook') ? response.credentials.additionalUserInfo.profile.picture.data.url : response.credentials.additionalUserInfo.profile.picture;
    }
    /**
     * @author Juan Antonio Guevara Flores
     * @param response
     * @param email
     * @param password
     * @param selectedSocialNetwork
     * @description Proceso que validar las credenciales cuando creas tu cuenta con redes sociales y retornar un Responder
     * @returns ResponderInterface
     */
    public proccessAfterCreateAccount(response: any, email: string, password: string, selectedSocialNetwork: SelectedSocialNetwork): ResponderInterface {
        const responder: ResponderInterface = new ResponderModel(selectedSocialNetwork);
        if (response.data.code !== 200) {
            responder.isSuccess = 'error';
            return responder;
        }
        const userData: UserSignInInterface = new UserSignInModel(email, password);
        userData.type = selectedSocialNetwork;
        responder.credentials = userData;
        return responder;
    }
}
