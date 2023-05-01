export interface NotificationInterface {
    id_usuario: number;
    token: string;
}

export class NotificationModel implements NotificationInterface {
    id_usuario: number;
    token: string;

    constructor(token: string, userId: number = null) {
        this.id_usuario = userId;
        this.token = token;
    }
}
