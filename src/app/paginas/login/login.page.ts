import {Component, OnInit} from '@angular/core';
import {Login} from "../../Modelos/login";
import {LoginService} from "../../api/login.service";
import {AppSettings} from "../../AppSettings";
import {Location} from '@angular/common';
import {SessionUtil} from "../../utils/sessionUtil";
import {SideBarService} from "../../api/busqueda/side-bar-service";
import {NavController} from "@ionic/angular";
import {Capacitor, Plugins, registerWebPlugin} from "@capacitor/core";
import {NavigationExtras, Router} from "@angular/router";
import {FacebookLogin} from "@rdlabo/capacitor-facebook-login";

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
    providers: [
        SessionUtil
    ]
})
export class LoginPage implements OnInit {

    public usuario: Login;
    public loader: boolean;

    constructor(
        private navctrl: NavController,
        private loginService: LoginService,
        private location: Location,
        private sessionUtil: SessionUtil,
        private sideBarService: SideBarService,
        private router: Router
    ) {
        this.loader = false;
        this.usuario = new Login();
        registerWebPlugin(FacebookLogin);
    }

    ngOnInit(): void {
    }

    doLogin() {
        this.loader = true;
        this.loginService.login(this.usuario).subscribe(
            respuesta => {
                const actualizado = AppSettings.setTokenUser(respuesta);
                // this.sideBarService.actualizarSide();
                // this.loader = false;
                this.sideBarService.publishSomeData('');
                this.navctrl.back()
            }, error => {
            }
        );
    }

    /**
     * Funcion para login por facebook
     * @author Omar
     */
    async signInFacebook(): Promise<void> {
        const FACEBOOK_PERMISSIONS = ['public_profile', 'email'];

        const result = await Plugins.FacebookLogin.login({ permissions: FACEBOOK_PERMISSIONS });
        console.log(result);
        if (result && result.accessToken) {
            let user = { token: result.accessToken.token, userId: result.accessToken.userId }
            console.log('Datos Facebook: ', user);
            let navigationExtras: NavigationExtras = {
                queryParams: {
                    userinfo: JSON.stringify(user)
                }
            };
            this.router.navigate(["/home"], navigationExtras);
        }
    }
}
