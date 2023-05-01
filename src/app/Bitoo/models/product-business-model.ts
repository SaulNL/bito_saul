export interface ProductBusinessInterface {
    name: string;
    url: string;
    isOpen: boolean;
    homeDelivery: boolean;
    deliveryOnSite: boolean;
    consumptionOnSite: boolean;
}
export class ProductoBusinessModel implements ProductBusinessInterface {
    constructor(
        public name: string = null,
        public url: string = null,
        public isOpen: boolean = null,
        public homeDelivery: boolean = null,
        public deliveryOnSite: boolean = null,
        public consumptionOnSite: boolean = null
    ) { }
}
