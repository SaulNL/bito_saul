export class OptionBackLogin {
    public type: string;
    public url: string | null;
    constructor(type: string = '', url: string | null = null) {
        this.type = type;
        this.url = url;
    }
}

