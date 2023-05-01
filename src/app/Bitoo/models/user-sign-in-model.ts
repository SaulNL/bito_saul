export interface UserSignInInterface {
    usuario: string | number;
    password: string;
    type: string;
}
export class UserSignInModel implements UserSignInInterface {
    public type: string;
    constructor(public usuario: string | number, public password: string) { }
}
