export interface ProductImageInterface {
    image: string;
}
export class ProductImageModel implements ProductImageInterface {
    constructor(public image: string) { }
}
