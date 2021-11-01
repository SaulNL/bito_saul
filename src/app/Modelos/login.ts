export class Login {
    password: string;
    usuario: string;
    type: string;

    constructor(password: string, usuario: string, type: string = '') {
        this.password = password;
        this.usuario = usuario;
        this.type = type;
    }
}
