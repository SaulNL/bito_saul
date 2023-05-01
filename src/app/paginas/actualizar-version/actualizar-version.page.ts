import {Component, OnInit} from '@angular/core';
import {Platform} from "@ionic/angular";
import {ActivatedRoute} from "@angular/router";
import {DeviceInfoModel} from "../../Modelos/DeviceInfoModel";
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
    selector: 'app-actualizar-version',
    templateUrl: './actualizar-version.page.html',
    styleUrls: ['./actualizar-version.page.scss'],
})
export class ActualizarVersionPage implements OnInit {
    public isIOS: boolean = false;
    public device: DeviceInfoModel;
    public subscribe;
    public isAndroid: boolean;
    public urlAndroid = "https://play.google.com/store/apps/details?id=mx.com.softura.bitoo.produccion";
    public urlIOS = "https://apps.apple.com/mx/app/bitoo/id1586676298"
    //public url= "https://bitoo.azurewebsites.net/descargar-app";
    constructor(private platform: Platform,
                private activatedRoute: ActivatedRoute) {
        this.device = new DeviceInfoModel();
        this.isAndroid = (this.platform.is('android'));
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

    public DescargarActualizacion(){
        if(this.isAndroid ){ 
            window.open(this.urlAndroid, '_target')
        }else{
            window.open(this.urlIOS, '_target')
        }
    }
}
