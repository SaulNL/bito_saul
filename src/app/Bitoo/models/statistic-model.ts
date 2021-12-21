
export interface StatisticsByBusinessInterface {
    idBusiness: number;
}
export class StatisticsByBusinessModel implements StatisticsByBusinessInterface {
    constructor(public idBusiness: number) { }
}

export interface BusinessStatisticsLoaderInterface {
    loadingVisitsByQr: boolean;
    loadingVisitsByUrl: boolean;
    loadingLikesBusiness: boolean;
    loadingLikesProducts: boolean;
    loadingCompanyRating: boolean;
    loadingTotalPromotions: boolean;
    loadingTotalRequests: boolean;
}
export class BusinessStatisticsLoaderModel implements BusinessStatisticsLoaderInterface {
    constructor(
        public loadingVisitsByQr: boolean = false,
        public loadingVisitsByUrl: boolean = false,
        public loadingLikesBusiness: boolean = false,
        public loadingLikesProducts: boolean = false,
        public loadingCompanyRating: boolean = false,
        public loadingTotalPromotions: boolean = false,
        public loadingTotalRequests: boolean = false,
    ) { }
}
export interface BusinessStatisticsInterface {
    totalVisitsByQr: number;
    totalVisitsByUrl: number;
    totalLikesBusiness: number;
    totalLikesProducts: number;
    goodGrade: number;
    averageRating: number;
    lowRating: number;
    totalRequests: number;
    totalPromotions: number;
    requests: Array<any>;
    promotions: Array<any>;
    products: Array<any>;
}

export class BusinessStatisticsModel implements BusinessStatisticsInterface {
    constructor(
        public totalVisitsByQr: number = 0,
        public totalVisitsByUrl: number = 0,
        public totalLikesBusiness: number = 0,
        public totalLikesProducts: number = 0,
        public goodGrade: number = 0,
        public averageRating: number = 0,
        public lowRating: number = 0,
        public totalRequests: number = 0,
        public totalPromotions: number = 0,
        public requests: Array<any> = [],
        public promotions: Array<any> = [],
        public products: Array<any> = []
    ) { }
}
