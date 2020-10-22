import {Component, OnInit} from '@angular/core';
import {MenuController} from "@ionic/angular";
import {UtilsCls} from "../../../utils/UtilsCls";
import {AppSettings} from "../../../AppSettings";

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.page.html',
    styleUrls: ['./dashboard.page.scss'],
    providers: [
        UtilsCls
    ]
})
export class DashboardPage implements OnInit {
    usuario: any;
    public url_user: string;
    correnume: any;
    public isRemainder: boolean;

    constructor(
        private util: UtilsCls,
        private menuController: MenuController,
    ) {
    }

    ngOnInit() {
        this.usuario = this.util.getData();
        this.url_user = AppSettings.API_ENDPOINT + 'img/user.png';
        if (this.usuario !== null) {
            if (typeof this.usuario.correo === "undefined") {
                this.correnume = this.usuario.telefono;
            } else {
                this.correnume = this.usuario.correo;
            }
        }
    }

    openFirst() {
        this.menuController.enable(true, 'first');
        this.menuController.open('first');
    }
}
