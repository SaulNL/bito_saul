export interface SendProductLikeInterface {
    idProducto: string;
}
export interface SendUserLikeInterface {
    id_persona: number;
}

export interface SendLikeProductInterface {
    producto: SendProductLikeInterface;
    usuario: SendUserLikeInterface;
}


export class SendProductLikeModel implements SendProductLikeInterface {
    constructor(public idProducto: string) { }
}

export class SendUserLikeModel implements SendUserLikeInterface {
    constructor(public id_persona: number) { }
}

export class SendLikeProductModel implements SendLikeProductInterface {
    public producto: SendProductLikeInterface;
    public usuario: SendUserLikeInterface;
    constructor(idProduct: string, idPerson: number) {
        this.producto = new SendProductLikeModel(idProduct);
        this.usuario = new SendUserLikeModel(idPerson);
    }
}

export interface ProductLikeInterface {
    like: boolean;
    likes: number;
    visibility: boolean;
    idPerson: number;
    idProduct: string;
}
export class ProductLikeModel implements ProductLikeInterface {
    constructor(public visibility: boolean, public like: boolean = false, public likes: number = 0, public idPerson: number = null, public idProduct: string = null) { }
}
