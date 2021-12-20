import { ProductInterface } from './product-model';
export interface AddToProductInterface {
    product: ProductInterface;
}

export class AddToProductModel implements AddToProductInterface {
    constructor(public product: ProductInterface) { }
}
export class byProductModel implements AddToProductInterface {
    constructor(public product: ProductInterface) { }
}
