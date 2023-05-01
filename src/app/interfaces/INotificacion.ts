export interface INotificationPayload {
    body?: string;
    title?: string;
    image?:string;

}
export interface IMessagePayload {
    notification: INotificationPayload,
    data?: { [key: string]: string }
}