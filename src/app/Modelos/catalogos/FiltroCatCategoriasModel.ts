
import { ArchivoComunModel } from "../ArchivoComunModel";
import { icon } from 'leaflet';
export class FiltroCatCategoriasModel {
    public id_giro: number;
    public nombre: string;
    public activo: number;
    public id_tipo_negocio: number;
//imagen
    public url_imagen: string;
    public imagen: ArchivoComunModel;
//imagen movil
    public url_imagen_movil: string;
    public imagen_movil: ArchivoComunModel;
//icono
    public url_icon: string;
    public icon: ArchivoComunModel;
    //banner
    public url_banner: string;
    public banner: ArchivoComunModel;

    //Imagen separador
  public url_imagen_separador: string;
  public imagen_separador: ArchivoComunModel;

    public peso: number;
    constructor(
        id_giro = null,
        nombre = null,
        activo = null,
        id_tipo_negocio = null,
        url_imagen = null,
        url_imagen_movil = null,
        url_icon = null,
        url_imagen_separador = null,
        url_banner = null,
        peso = null,
    ) {
        this.id_giro = id_giro;
        this.nombre = nombre;
        this.activo = nombre;
        this.id_tipo_negocio = id_tipo_negocio;
        this.url_imagen = url_imagen;
        this.imagen = null;
        this.url_imagen_movil = url_imagen_movil;
        this.imagen_movil = null;
        this.url_icon = url_icon;
        this.url_imagen_separador = url_imagen_separador;
        this.imagen_separador = null;
        this.icon = null;
        this.url_banner = url_banner;
        this.banner = null;
        this.peso = peso;

    }
}
