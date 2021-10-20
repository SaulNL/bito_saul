import { AccessPermissionService } from './api/access-permission.service';
import { Component } from '@angular/core';

import { ModalController, NavController, Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Deeplinks } from '@ionic-native/deeplinks/ngx';
import { Router } from '@angular/router';
import { NgZone } from '@angular/core';
import { NegocioService } from './api/negocio.service';
import { VistasBitooModel } from 'src/app/Modelos/vistasBitooModel';
import { Plugins } from '@capacitor/core';
import { VersionAndroidService } from './api/version-android.service';
import { AppSettings } from './AppSettings';
const { Geolocation } = Plugins;
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  visitasBitooModel: VistasBitooModel;
  public version: number;
  public versionActualSistema: number;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private deeplinks: Deeplinks,
    private router: Router,
    private zone: NgZone,
    private navController: NavController,
    private negocioService: NegocioService,
    private access: AccessPermissionService,
    public modalController: ModalController,
    private android: VersionAndroidService

  ) {
    this.initializeApp();
    this.visitasBitooModel = new VistasBitooModel();
    // location.reload();
    this.version = 0;
    this.versionActualSistema = AppSettings.VERSION_SISTEMA;
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.obtenerVersion();
    });
    this.obtenerIP();
  }
  private getIdUsuarioSistema(): number {
    let id_usuario = 0;
    try {
      const usuario_sistema = JSON.parse(localStorage.getItem("u_sistema"));
      id_usuario = usuario_sistema.id_usuario_sistema;
      return id_usuario;
    } catch (e) {
      return 0;
    }
  }
  setupDeeplinks() {
    this.deeplinks.routeWithNavController(this.navController, {}).subscribe(
      (match) => {

        const url: any = match.$link["url"].split("/");

        if (url[2] === match.$link["host"]) {
          this.zone.run(() => {
            let url_negocio: string;
            if (match.$link.path.includes('qr')) {
              url_negocio = match.$link.path.slice(0, -2);
              this.router.navigateByUrl('/tabs/negocio' + url_negocio);
              this.obtenerIdNegocioUrl(url_negocio.slice(1));
              this.modalController.dismiss();
            } else {
              if (match.$link.path.includes('miafiliacion')) {
                let urlTempA = match.$link.path.slice(1);
                const urlAfiliacion = urlTempA.slice(13);
                this.obtenerAfiliacion(urlAfiliacion);
              } else if (match.$link.path.includes('plaza')) {
                let urlTempP = match.$link.path.slice(1);
                const urlPlaza = urlTempP.slice(6);
                this.obtenerPlaza(urlPlaza);
              } else {
                this.router.navigateByUrl('/tabs/negocio' + match.$link["path"]);
                this.modalController.dismiss();
              }
            }
          });
        }
      }, (nomatch) => {
        console.error('Got a deeplink that didn\'t match', nomatch);
      });
  }
  guardarQuienVioNegocioQr(id_negocio: number) {
    this.negocioService.visteMiNegocioQr(id_negocio).subscribe(
      response => {
        if (response.data !== null) {
        }
      },
      error => {

      }
    );
  }
  obtenerIdNegocioUrl(url_negocio: string) {
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
  obtenerVersion() {
    this.android.obtenerVersion().subscribe(
      (response) => {
        this.version = response.data;
        this.verificarVersion(response.data);
      }, (error) => {
        this.router.navigate(['/actualizar-version']);
      }
    );
  }

  verificarVersion(version: number) {
    if (this.versionActualSistema != version) {
      this.router.navigate(['/actualizar-version']);
    } else {
      this.setupDeeplinks();
      this.obtenerPlataforma();
      if (this.isAuthenticated()) {
        this.updatePermisosByUser(this.getIdUsuarioSistema());
      }
    }
  }

  obtenerPlaza(url: string) {
    this.access.plazaAcceso(url).subscribe(
      (response) => {
        if (response.code === 200) {
          localStorage.setItem('org', JSON.stringify(response.data.plz));
          this.router.navigate(['/tabs/inicio']);
          location.reload();
        } else {
          this.router.navigate(['/tabs/inicio']);
        }
      },
      (error) => {
        this.router.navigate(['/tabs/inicio']);
      }
    );
  }

  obtenerAfiliacion(url: string) {

    if (this.isAuthenticated()) {

      this.access.permisoAfiliacion(url, this.getIdPersona()).subscribe(
        (response) => {
          if (response.code === 200) {
            localStorage.setItem('org', JSON.stringify(response.data.org));
            this.router.navigate(['/tabs/inicio']);
            location.reload();
          } else {
            this.router.navigate(['/tabs/inicio']);
          }
        },
        (error) => {
          this.router.navigate(['/tabs/inicio']);
        }
      );
    } else {
      this.router.navigate(['/tabs/inicio']);
    }

  }

  obtenerPlataforma() {
    if (this.platform.is("android")) {
      this.visitasBitooModel.plataforma = "android";
    } else if (this.platform.is("ios")) {
      this.visitasBitooModel.plataforma = "ios";
    }
  }
  obtenerIP() {
    this.negocioService.obtenerIP().subscribe(res => {
      this.visitasBitooModel.usuario_ip = res.ip;
      this.getCurrentPosition();
    }, error => { });
  }
  async getCurrentPosition() {
    let gpsOptions = { maximumAge: 30000000, timeout: 5000, enableHighAccuracy: true };
    const coordinates = await Geolocation.getCurrentPosition(gpsOptions).then(res => {
      this.visitasBitooModel.latitud = res.coords.latitude;
      this.visitasBitooModel.longitud = res.coords.longitude;
    }).catch(error => {
      this.visitasBitooModel.latitud = null;
      this.visitasBitooModel.longitud = null;
    });
    this.registrarVisitas();
  }

  registrarVisitas() {
    this.negocioService.guardarRegistro(this.visitasBitooModel).subscribe(data => {

    }, (error) => {

    });
  }
  isAuthenticated() {
    const token = localStorage.getItem('tk_str');
    if (token !== null && token !== undefined) {
      return true;
    }
    return false;
  }
  getUserData() {
    if (localStorage.getItem('u_data')) {
      return JSON.parse(localStorage.getItem('u_data'));
      //return localStorage.getItem('u_data');
    }
    return new Object({});
  }

  getIdPersona(): number {
    const data = this.getUserData();
    if (this.isAuthenticated() && data) {
      return data.id_persona;
    }
    return 0;
  }

  private updatePermisosByUser(userSistem: number) {
    this.access.permisos(userSistem).subscribe(
      response => {
        localStorage.removeItem('u_permisos');
        localStorage.setItem('u_permisos', JSON.stringify(response.data));
      }, error => {
        console.log("error");
      }
    )
  }
}
