import {Injectable} from '@angular/core';

// En cargado de hacer la validación en el api de Node


@Injectable()
export class Auth0Service {

    constructor() {
    }

    isAuthenticated() {
        const token = localStorage.getItem('tk_str');
        if (token !== null && token !== undefined) {
            return true;
        }
        return false;


    }

    getUserPermisos() {
        if (localStorage.getItem('u_data')) {
            return JSON.parse(localStorage.getItem('u_permisos'));
        }
        return null;
    }

    getUserData() {
        if (localStorage.getItem('u_data')) {
            return JSON.parse(localStorage.getItem('u_data'));
            //return localStorage.getItem('u_data');
        }
        return new Object({});
    }

    getPrivilegio() {
        if (localStorage.getItem('u_sistema')) {
            return JSON.parse(localStorage.getItem('u_sistema'));
            //return localStorage.getItem('u_data');
        }
        return new Object({});
    }

    getIdPrivilegio(): number {
        const data = this.getPrivilegio();
        if (this.isAuthenticated() && data) {
            return data.id_usuario_perfil;
        }
        return 0;
    }

    getIdPersona(): number {
        const data = this.getUserData();
        if (this.isAuthenticated() && data) {
            return data.id_persona;
        }
        return 0;
    }

    getIdProveedor() {
        let id = 0;
        try {
            const persona = JSON.parse(localStorage.getItem('u_data'));
            id = persona.proveedor.id_proveedor;
        } catch (e) {
            return 0;
        }
        return id;
    }
}
