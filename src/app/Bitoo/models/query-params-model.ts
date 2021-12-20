

export class CloseProductDetailModel {
    public byCloseProduct: string;

    constructor(product: string) {
        this.byCloseProduct = product;
    }
}

export class BackToProductDetailModel {
    public byProfile: string;
    constructor(product: string) {
        this.byProfile = product;
    }
}

export class ByProductDetailModel {
    public byProductDetail: string;
    constructor(product: string) {
        this.byProductDetail = product;
    }
}

export class ProductFavoriteModel {
    public productByFavorite: string;
    constructor(content: string) {
        this.productByFavorite = content;
     }
}
