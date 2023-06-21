export class ProductoModel{
    public nombre: string;
    public descripcion: string;
    public precio: string;
    public categoria: string;
    public imagenes: string;
    public negocio: any;

    public imagen:string;
    public nombre_categoria1:string;
    public tipo:any;
    public ubicacion: any;
    public likes: any;
    public usuario_dio_like: any;

    public idProducto: any;
    public select: any;
    public existencia: any;
    public cantidad_disponible: any;

    constructor(nombre = null, descripcion = null, precio = null, categoria = null, imagenes = null, negocio = null, idProducto = null, usuario_dio_like = null) {
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precio = precio;
        this.categoria = categoria;
        this.imagenes = imagenes;
        this.negocio = negocio;
        this.idProducto = idProducto;
        this.usuario_dio_like = usuario_dio_like;
    }
}
