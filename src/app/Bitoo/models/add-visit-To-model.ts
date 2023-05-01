export interface AddVisitToProductInterface {
    id_persona: number;
    id_producto: string;
}

export class AddVisitToProductModel implements AddVisitToProductInterface {
    public id_persona: number;
    public id_producto: string;

    constructor(idPerson: number, idProduct: string) {
        this.id_persona = idPerson;
        this.id_producto = idProduct;
    }
}
