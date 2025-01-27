import { CreateObjects } from './Bitoo/helper/create-object';
import { ValidatorData } from './Bitoo/helper/validations';
import { NotificationInterface } from './Bitoo/models/notifications-model';
import { NotificationWithFirebaseService } from './api/notification-with-firebase.service';
import { AccessPermissionService } from './api/access-permission.service';
import { Component } from '@angular/core';
import { ModalController, NavController, Platform } from '@ionic/angular';
//import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Deeplinks } from '@ionic-native/deeplinks/ngx';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { NgZone } from '@angular/core';
import { NegocioService } from './api/negocio.service';
import { VistasBitooModel } from 'src/app/Modelos/vistasBitooModel';
import { VersionAndroidService } from './api/version-android.service';
import { AppSettings } from './AppSettings';
import { Geolocation } from '@capacitor/geolocation';
import { DeviceInfoModel } from "./Modelos/DeviceInfoModel";
import { SplashScreen } from '@capacitor/splash-screen';
import { App } from '@capacitor/app';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss'],
    providers: [ValidatorData, CreateObjects]
})
export class AppComponent {
    visitasBitooModel: VistasBitooModel;
    public version: number;
    public device: number;
    public versionActualSistema: number;
    public temporal: DeviceInfoModel;
    public inicio: boolean;
    public rutas = [
        "/tabs/home?special=true",
        "/tabs/home",
        "/tabs/home/negocio",
        "/tabs/home/solicitudes",
        "/tabs/home/promociones",
        "/tabs/mis-favoritos",
        "/tabs/home/preferencias",
        "/tabs/mis-eventos",
        "/tabs/home/ser-proveedor"
    ]

    constructor(
        private platform: Platform,
        //private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        private deeplinks: Deeplinks,
        private router: Router,
        private zone: NgZone,
        private navController: NavController,
        private negocioService: NegocioService,
        private access: AccessPermissionService,
        public modalController: ModalController,
        private android: VersionAndroidService,
        private notification: NotificationWithFirebaseService,
        private validate: ValidatorData,
        private create: CreateObjects,
        private route: ActivatedRoute
    ) {
        this.initializeApp();
        this.visitasBitooModel = new VistasBitooModel();
        this.versionActualSistema = (this.platform.is('android')) ? AppSettings.VERSION_ANDROID : AppSettings.VERSION_IOS;
        this.device = (this.platform.is('android')) ? AppSettings.ID_DB_PLATFORM_ANDROID : AppSettings.ID_DB_PLATFORM_IOS;
        this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                this.inicio = this.rutas.find(element => element == event.url) ? true : false;
            }
        });
    }

    /* appLinks() {
        
        App.addListener('appUrlOpen', data => {
            
          //let url = data.url.slice(9);

          //alert('App opened with URL:' + JSON.stringify(data.url))
          
          //this.router.navigateByUrl('/tabs/' + url);
        });
    } */


    initializeApp() {
        this.platform.ready().then(async () => {
            this.statusBar.styleDefault();
            await SplashScreen.hide();
            //this.appLinks();
            this.obtenerVersion(this.device);
        });
        this.obtenerIP();
        this.inicializeNotifications();
    }

    /**
   * @author Juan Antonio Guevara Flores
   * @description Inicializa y registra el token para las notificaciones
   */
    private inicializeNotifications() {
        this.notification.inicialize();
        if (this.validate.activeNotification()) {
            const content: NotificationInterface = this.create.createNotificationFirebaseWithUser();
            this.notification.updateUserWithNotification(content);
        }
    }

    public getIdUsuarioSistema(): number {
        let id_usuario = 0;
        try {
            const usuario_sistema = JSON.parse(localStorage.getItem("u_sistema"));
            id_usuario = usuario_sistema.id_usuario_sistema;
            return id_usuario;
        } catch (e) {
            return 0;
        }
    }

    public getTokenNotificationSistema(): string {
        try {
            const tkn = localStorage.getItem("nftoken");
            if (tkn === null) {
                return '';
            }
            return tkn;
        } catch (e) {
            return '';
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
                            } else if (match.$link.path.includes('promocion')) {
                                this.router.navigateByUrl("/tabs" + match.$link["path"]);
                                this.modalController.dismiss();
                            } else if (match.$link.path.includes('pago-realizado')) {
                                this.router.navigateByUrl("/tabs" + match.$link["path"]);
                                this.modalController.dismiss();
                            } else {
                                this.router.navigateByUrl('/tabs/negocio' + match.$link["path"]);
                                this.modalController.dismiss();
                            }
                        }
                    });
                }
            }, () => {
            });
    }

    guardarQuienVioNegocioQr(id_negocio: number) {
        this.negocioService.visteMiNegocioQr(id_negocio).subscribe(
            response => {
                if (response.data !== null) {
                }
            },
            () => {

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
            () => {

            }
        );
    }

    obtenerVersion(idDevice: number) {
        this.android.getDeviceInfo(idDevice).subscribe(
            (response) => {
                this.verificarVersion(response.data);
            }, () => {

            }
        );
    }

    verificarVersion(deviceInfo: DeviceInfoModel) {
        if (this.versionActualSistema < deviceInfo.version && deviceInfo.active) {
            this.router.navigate(['/tabs/actualizar-version'], { queryParams: { blockedUp: JSON.stringify(deviceInfo) } });
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
            () => {
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
                () => {
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
        }, () => {
        });
    }

    async getCurrentPosition() {
        let gpsOptions = { maximumAge: 30000000, timeout: 5000, enableHighAccuracy: true };
        await Geolocation.getCurrentPosition(gpsOptions).then(res => {
            this.visitasBitooModel.latitud = res.coords.latitude;
            this.visitasBitooModel.longitud = res.coords.longitude;
        }).catch(() => {
            this.visitasBitooModel.latitud = null;
            this.visitasBitooModel.longitud = null;
        });
        this.registrarVisitas();
    }

    registrarVisitas() {
        this.negocioService.guardarRegistro(this.visitasBitooModel).subscribe(() => {

        }, () => {

        });
    }

    isAuthenticated() {
        const token = localStorage.getItem('tk_str');
        return token !== null && token !== undefined;

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
            }, () => {
            }
        )
    }

}
