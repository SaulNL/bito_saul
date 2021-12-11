export interface ReturnoToInterface {
    type: string;
    url: string;
}
export class ReturnToModel implements ReturnoToInterface {
    constructor(public type: string, public url: string) { }
}
