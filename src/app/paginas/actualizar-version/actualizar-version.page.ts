import {Component, OnInit} from '@angular/core';
import {Platform} from "@ionic/angular";
import {ActivatedRoute} from "@angular/router";
import {DeviceInfoModel} from "../../Modelos/DeviceInfoModel";

@Component({
    selector: 'app-actualizar-version',
    templateUrl: './actualizar-version.page.html',
    styleUrls: ['./actualizar-version.page.scss'],
})
export class ActualizarVersionPage implements OnInit {
    public isIOS: boolean = false;
    public device: DeviceInfoModel;
    public subscribe;

    constructor(private platform: Platform,
                private activatedRoute: ActivatedRoute) {
        this.device = new DeviceInfoModel();
        this.platform.backButton.subscribeWithPriority(9999, () => {
            document.addEventListener('backbutton', function (event) {
                event.preventDefault();
                event.stopPropagation();
            }, false);
        });
    }

    ngOnInit() {
        this.activatedRoute.queryParams.subscribe(params => {
            if (params.blockedUp && params) {
                this.device = JSON.parse(params.blockedUp);
            }
        });
    }

    get getUrl() {
        return this.device.url;
    }

    get getImagen() {
        return this.device.imagen;
    }

    public goUrl() {
        window.open(this.device.url, '_target')
    }
}
