import { UserModel, UserInterface } from './user-model';
export interface UserSignUpInterface {
    password: string;
    repeat_password: string;
    idCode: number;
    codigo: number;
    ms_persona: UserInterface;
}

export class UserSignUpModel implements UserSignUpInterface {
    password: string;
    repeat_password: string;
    idCode: number;
    codigo: number;
    ms_persona: UserInterface;

    constructor(password: string = null, repeatPassword: string = null, idCode: number = null, code: number = null, user: UserInterface = new UserModel()) {
        this.password = password;
        this.repeat_password = repeatPassword;
        this.idCode = idCode;
        this.codigo = code;
        this.ms_persona = user;
    }
}

export interface CommonUserSignUpInterface {
    firstName: string;
    email: string;
    photoUrl: string;
    id: number;
}

export class CommonUserSingUpModel implements CommonUserSignUpInterface {
    constructor(public firstName: string, public email: string, public photoUrl: string, public id: number) { }
}

export interface ContentCommonUserSingUpInterface {
    password: string;
    content: CommonUserSingUpModel;
}

export class ContentCommonUserSingUpModel implements ContentCommonUserSingUpInterface {
    constructor(public password: string, public content: CommonUserSingUpModel) { }
}
