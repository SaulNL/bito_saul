import { ProductBusinessInterface } from "./product-business-model";
import { ProductInterface } from "./product-model";

export interface ReturnoToInterface {
    type: string;
    url: string;
}
export class ReturnToModel implements ReturnoToInterface {
    constructor(public type: string, public url: string) { }
}

export interface ReturnToProductInterface {
    product: ProductInterface;
    business: ProductBusinessInterface;
}
export class ReturnToProductModel implements ReturnToProductInterface {
    public product: ProductInterface;
    public business: ProductBusinessInterface;
    constructor(product: ProductInterface, business: ProductBusinessInterface){
        this.product = product;
        this.business = business;
    }
}
