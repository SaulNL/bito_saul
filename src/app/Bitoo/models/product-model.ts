import { ProductImageInterface } from './product-images-model';
export interface ProductInterface {
    name: string;
    description: string;
    exist: boolean;
    images: Array<ProductImageInterface>;
    likes: number;
    idBusiness: number;
    price: number;
    like: boolean;
    idProduct: string;
}

export class ProductModel implements ProductInterface {
    constructor(
        public name: string = null,
        public description: string = null,
        public exist: boolean = null,
        public images: Array<ProductImageInterface> = null,
        public likes: number = null,
        public idBusiness: number = null,
        public price: number = null,
        public like: boolean = null,
        public idProduct: string = null
    ) { }
}
