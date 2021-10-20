export class DeviceInfoModel {
    public url: string;
    public active: number;
    public version: number;
    public imagen: string;

    constructor(url: string = '', active: number = 0, version: number = 0, imagen: string = '') {
        this.url = url;
        this.active = active;
        this.version = version;
        this.imagen = imagen;
    }
}
