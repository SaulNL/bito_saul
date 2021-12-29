import { NotificationInterface, NotificationModel } from './../models/notifications-model';
import { ProductLikeInterface, ProductLikeModel } from '../models/product-like-model';
import { ProductBusinessInterface, ProductoBusinessModel } from '../models/product-business-model';
import { ProductImageInterface, ProductImageModel } from '../models/product-images-model';
import { ProductInterface, ProductModel } from '../models/product-model';
export class CreateObjects {
    /**
     * @author Juan Antonio Guevara Flores
     * @description Crea el objeto de tipo ProductInterface para el page: ProductDetailPage
     * @param object
     * @returns ProductInterface
     */
    public createProduct(object: any): ProductInterface {
        const product: ProductInterface = new ProductModel();
        product.description = this.transformText(object.descripcion);
        product.exist = object.existencia;
        product.idBusiness = object.negocio.idNegocio;
        product.idProduct = object.idProducto;
        product.images = this.createArrayProductImages(object.imagen);
        product.likes = this.getLikes(object.likes);
        product.like = this.getLike(object.usuario_dio_like);
        product.name = this.transformText(object.nombre);
        product.price = this.anyToNumber(object.precio);
        return product;
    }

    /**
     * @author Juan Antonio Guevara Flores
     * @description tranforma todo el texto a minuscula
     * @param text
     * @returns
     */
    private transformText(text: string) {
        return text.toLowerCase();
    }

    /**
     * @author Juan Antonio Guevara Flores
     * @description Obtiene los Likes si esta logeado si no retorna null
     * @param object
     * @returns
     */
    private getLikes(object: any) {
        if (this.existSesion()) {
            return this.anyToNumber(object);
        }
        return null;
    }
    /**
     * @author Juan Antonio Guevara Flores
     * @description Transforma el any a un number y lo retorna
     * @param object
     * @returns number
     */
    public anyToNumber(object: any): number {
        const number: number = Number(object);
        if (isNaN(number)) {
            return 0;
        }
        return number;
    }
    /**
     * @author Juan Antonio Guevara Flores
     * @description Retorna si el usuario dio like o no
     * @param object
     * @returns
     */
    private getLike(object: any) {
        if (this.existSesion()) {
            return this.isTrue(object);
        }
        return false;
    }

    /**
     * @author Juan Antonio Guevara Flores
     * @description Crea un array de ProductImagesInterface para el SliderImagesComponent
     * @param object
     * @returns ProductImageInterface[]
     */
    public createArrayProductImages(object: any): ProductImageInterface[] {
        const productImages: Array<ProductImageInterface> = [];
        if (Array.isArray(object)) {
            object.forEach(element => {
                productImages.push(this.createProductImage(element));
            });
        } else {
            productImages.push(this.createProductImage(object));
        }
        return productImages;
    }

    /**
     * @author Juan Antonio Guevara Flores
     * @description Crea un objeto de tipo ProductImageModel
     * @param object
     * @returns
     */
    public createProductImage(object: any): ProductImageModel {
        return new ProductImageModel(object);
    }

    /**
     * @author Juan Antonio Guevara Flores
     * @description Crea el objeto del negocio para el page ProductDetailPage
     * @param object
     * @returns ProductBusinessInterface
     */
    public createProductBusiness(object: any): ProductBusinessInterface {
        const productBusiness: ProductBusinessInterface = new ProductoBusinessModel();
        productBusiness.consumptionOnSite = this.isTrue(object.consumo_sitio);
        productBusiness.deliveryOnSite = this.isTrue(object.entrega_sitio);
        productBusiness.homeDelivery = this.isTrue(object.entrega_domicilio);
        productBusiness.isOpen = this.isTrue(object.abierto);
        productBusiness.name = this.transformText(object.nombre_comercial);
        productBusiness.url = object.url_negocio;
        return productBusiness;
    }

    /**
     * @author Juan Antonio Guevara Flores
     * @description Crea el objeto para el componentes de LikeProductComponent
     * @param product
     * @returns ProductLikeInterface
     */
    public createProductLike(product: ProductInterface): ProductLikeInterface {
        const productLike: ProductLikeInterface = new ProductLikeModel(this.existSesion());
        if (productLike.visibility) {
            productLike.idProduct = product.idProduct;
            productLike.idPerson = this.getIdPerson();
            productLike.like = product.like;
            productLike.likes = product.likes;
        }
        return productLike;
    }

    /**
     * @author Juan Antonio Guevara Flores
     * @description Valida si esl objeto es verdadero
     * @param object
     * @returns boolean
     */
    private isTrue(object: any): boolean {
        return (
            (
                object === 1 ||
                object === 'ABIERTO'
            ) && (
                object !== undefined ||
                object !== null ||
                object !== 'undefined')
        );
    }
    /**
     * @author Juan Antonio Guevara Flores
     * @description Retornar si existe una sesion iniciada
     * @returns boolean
     */
    public existSesion(): boolean {
        try {
            const tk_str = localStorage.getItem("tk_str");
            if (tk_str != null && tk_str != "") {
                return true;
            }
            return false;
        } catch (e) {
            return false;
        }
    }

    /**
     * @author Juan Antonio Guevara Flores
     * @description Obtiene el id de la persona
     * @returns number
     */
    public getIdPerson(): number {
        try {
            /**
             * @description falta crear el la interface que describe el contenido de u_data
             */
            const persona = JSON.parse(localStorage.getItem("u_data"));
            return persona.id_persona;
        } catch (e) {
            return null;
        }
    }

    /**
     * @author Juan Antonio Guevara Flores
     * @description Crea el objeto para el servicio de actualizacion de token de notificacion con usuario
     * @returns NotificationInterface
     */
    public createNotificationFirebaseWithUser(): NotificationInterface {
        const usuarioSistema = JSON.parse(localStorage.getItem('u_sistema'));
        return this.createNotificationFirebase(usuarioSistema.id_usuario_sistema);
    }

    /**
     * @author Juan Antonio Guevara Flores
     * @description Crea el objeto para el servicio de actualizacion de token de notificacion sin usuario (Cierre de sesión)
     * @returns NotificationInterface
     */
    public createNotificationFirebaseWithNotUser(): NotificationInterface {
        return this.createNotificationFirebase();
    }

    /**
     * @author Juan Antonio Guevara Flores
     * @description Crea el objecto para los retornos dependiendo si es para usuario con sesión o sin sesión(cierre de sesión)
     * @param idUser
     * @returns
     */
    private createNotificationFirebase(idUser: number = null): NotificationInterface {
        const nftoken = localStorage.getItem('nftoken');
        const contentNotification: NotificationInterface = new NotificationModel(nftoken, idUser);
        return contentNotification;
    }
}
