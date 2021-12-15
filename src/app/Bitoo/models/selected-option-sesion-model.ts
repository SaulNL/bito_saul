import { SelectedSocialNetwork } from './../types/platform-type';
import { OptionSesion } from './../types/option-sesion';
export interface SelectedOptionSesionInterface {
    optionSesion: OptionSesion;
    selectedSocialNetwork: SelectedSocialNetwork;
}

export class SelectedOptionSesionModel implements SelectedOptionSesionInterface {
    constructor(public optionSesion: OptionSesion, public selectedSocialNetwork: SelectedSocialNetwork = null) { }
}
