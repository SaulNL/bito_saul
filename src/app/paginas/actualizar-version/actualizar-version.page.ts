import {Component, OnInit} from '@angular/core';
import {Platform} from "@ionic/angular";

@Component({
    selector: 'app-actualizar-version',
    templateUrl: './actualizar-version.page.html',
    styleUrls: ['./actualizar-version.page.scss'],
})
export class ActualizarVersionPage implements OnInit {
    public isIOS: boolean = false;

    constructor(private platform: Platform) {
        this.isIOS = this.platform.is('ios');
    }

    ngOnInit() {
        console.log(this.isIOS);
    }
}
