import { IsSuccess } from './../types/is-success-type';
import { SelectedSocialNetwork } from './../types/platform-type';
export interface ResponderInterface {
    isSuccess: IsSuccess;
    credentials: any | null;
    socialNetwork: SelectedSocialNetwork;
}

export class ResponderModel implements ResponderInterface {
    constructor(public socialNetwork: SelectedSocialNetwork, public isSuccess: IsSuccess = 'success', public credentials: any | null = null) { }
}
