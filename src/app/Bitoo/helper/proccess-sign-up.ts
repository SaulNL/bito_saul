import { UserSignInInterface, UserSignInModel } from './../models/user-sign-in';
import { SelectedSocialNetwork } from './../types/platform-type';
import { CommonUserSignUpInterface, CommonUserSingUpModel, ContentCommonUserSingUpModel } from './../models/user-sign-up-model';
import { ResponderModel, ResponderInterface } from './../models/responder-model';
export class ProccessSignUp {

    public proccessCreateAccountModel(response: ResponderModel) {
        const content = response.credentials;
        const credentials = content.user;
        const password = credentials.providerData[0].uid;
        const photo: string = this.getPictureProfile(response);
        const user: CommonUserSignUpInterface = new CommonUserSingUpModel(credentials.providerData[0].displayName,
            credentials.providerData[0].email, photo, password);
        return new ContentCommonUserSingUpModel(password, user);
    }

    private getPictureProfile(response: ResponderModel): string {
        return (response.socialNetwork === 'facebook') ? response.credentials.additionalUserInfo.profile.picture.data.url : response.credentials.additionalUserInfo.profile.picture;
    }

    public proccessAfterCreateAccount(response: any, email: string, password: string, selectedSocialNetwork: SelectedSocialNetwork) {
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
