import { Component } from '@angular/core';

import { NavController, Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Deeplinks } from '@ionic-native/deeplinks/ngx';
import { Router } from '@angular/router';
import { NgZone } from '@angular/core';
import { NegocioService } from './api/negocio.service';
import { VistasBitooModel } from 'src/app/Modelos/vistasBitooModel';
import { Plugins } from '@capacitor/core';
const { Geolocation } = Plugins;
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  visitasBitooModel: VistasBitooModel
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private deeplinks: Deeplinks,
    private router: Router,
    private zone: NgZone,
    private navController: NavController,
    private negocioService: NegocioService

  ) {
    this.initializeApp();
    this.visitasBitooModel = new VistasBitooModel();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.setupDeeplinks();
      this.obtenerPlataforma();
    });
    this.obtenerIP();
  }

  setupDeeplinks() {
    this.deeplinks.routeWithNavController(this.navController, {}).subscribe(
      (match) => {

        const url:any = match.$link["url"].split("/");
        if(url[2] === match.$link["host"]){
          this.zone.run(() => {
            let url_negocio:string;
            if(match.$link.path.includes('qr')){
              url_negocio = match.$link.path.slice(0,-2);
              this.router.navigateByUrl('/tabs/negocio'+url_negocio);
              this.obtenerIdNegocioUrl(url_negocio.slice(1));
            }else{
              this.router.navigateByUrl('/tabs/negocio'+match.$link["path"]);
            }
          });
        }
       }, (nomatch) => {
        console.error('Got a deeplink that didn\'t match', nomatch);
       });
  }

  guardarQuienVioNegocioQr(id_negocio: number){
    this.negocioService.visteMiNegocioQr(id_negocio).subscribe(
      response => {
        if (response.data !== null) {
        }
      },
      error => {

      }
    );
  }
  obtenerIdNegocioUrl(url_negocio: string){
    this.negocioService.obtenerIdNegocioUrl(url_negocio).subscribe(
      response => {
        if (response.data !== null) {
          this.guardarQuienVioNegocioQr(response.data);
        }
      },
      error => {

      }
    );
  }
  obtenerPlataforma(){
    if(this.platform.is("android")){
        this.visitasBitooModel.plataforma = "android";
    }else if(this.platform.is("ios")){
        this.visitasBitooModel.plataforma = "ios";
    }
}
obtenerIP(){
  this.negocioService.obtenerIP().subscribe( res => {
      this.visitasBitooModel.usuario_ip = res.ip;
      this.getCurrentPosition();
  }, error => {});
}
async getCurrentPosition() {
    let gpsOptions = {maximumAge: 30000000, timeout: 5000, enableHighAccuracy: true};
    const coordinates = await Geolocation.getCurrentPosition(gpsOptions).then(res => {
        this.visitasBitooModel.latitud = res.coords.latitude;
        this.visitasBitooModel.longitud = res.coords.longitude;
    }).catch(error => {
        this.visitasBitooModel.latitud = null;
        this.visitasBitooModel.longitud = null;
    });
    this.registrarVisitas();
}

registrarVisitas(){
    this.negocioService.guardarRegistro(this.visitasBitooModel).subscribe( data => {

    },(error) =>{
        
    });
}
}
