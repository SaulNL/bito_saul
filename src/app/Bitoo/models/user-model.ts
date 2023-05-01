export interface UserInterface {
    nombre: string;
    paterno: string;
    materno: string;
    correo: string;
    telefono_celular: number;
}
export class UserModel implements UserInterface {
    constructor(
        public nombre: string = null,
        public paterno: string = null,
        public materno: string = null,
        public correo: string = null,
        public telefono_celular: number = null
    ) { }
}
