import {MsPersonaModel} from "./MsPersonaModel";

export class UsuarioSistemaModel {

    public id_usuario_sistema: number;
    public usuario: string;
    public password: string;
    public fecha_alta: string;
    public verificado: string;
    public temp_password: string;
    public id_cat_idioma: number;
    public id_usuario_perfil: number;
    public id_persona: number;
    public id_cat_estatus_usuario: number;

    public ms_persona: MsPersonaModel;

    public old_password: string;
    public repeat_password: string;

    public codigo:string;
    public idCode:number;

    constructor(
        id_usuario_sistema: number = 0,
        usuario: string = '',
        password: string = '',
        fecha_alta: string = '',
        verificado: string = 'no',
        temp_password: string = '',
        id_cat_idioma: number = 1,
        id_usuario_perfil: number = 1,
        id_persona: number = null,
        id_cat_estatus_usuario: number = 1
    ) {
        this.id_usuario_sistema = id_usuario_sistema;
        this.usuario = usuario;
        this.password = password;
        this.fecha_alta = fecha_alta;
        this.verificado = verificado;
        this.verificado = verificado;
        this.temp_password = temp_password;
        this.id_cat_idioma = id_cat_idioma;
        this.id_usuario_perfil = id_usuario_perfil;
        this.id_persona = id_persona;
        this.id_cat_estatus_usuario = id_cat_estatus_usuario;

        //objetos por la referencias de la BD
        this.ms_persona = new MsPersonaModel();

        //para el change_password
        this.old_password = null;
        this.repeat_password = null;
    }

}
