import {Component, OnInit} from '@angular/core';
import {Login} from "../../Modelos/login";
import {LoginService} from "../../api/login.service";
import {AppSettings} from "../../AppSettings";
import {Location} from '@angular/common';
import {SessionUtil} from "../../utils/sessionUtil";
import {SideBarService} from "../../api/busqueda/side-bar-service";
import {ModalController, NavController} from "@ionic/angular";
import {Router} from "@angular/router";
import { ToadNotificacionService } from "../../api/toad-notificacion.service";
import {RecuperarContraseniaPage} from "./recuperar-contrasenia/recuperar-contrasenia.page";

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
        private _router: Router,
        private notifi: ToadNotificacionService,
        private modalController: ModalController,
    ) {
        this.loader = false;
        this.usuario = new Login();
    }

    ngOnInit(): void {
    }

    doLogin() {
        this.loader = true;
        this.loginService.login(this.usuario).subscribe(
            respuesta => {
                if (respuesta.code === 200) {
                    const actualizado = AppSettings.setTokenUser(respuesta);
                    console.log(respuesta.data);
                    // this.sideBarService.actualizarSide();
                    // this.loader = false;
                    this.sideBarService.publishSomeData('');
                    localStorage.setItem("isRedirected", "false");
                    this.navctrl.back();
                    this.notifi.exito(respuesta.message);
                  }
                  if (respuesta.code === 402){
                    this.notifi.alerta("Usuario y/o contraseña incorrectos");
                  }


            }, error => {
                this.notifi.error(error);
            }
        );
    }
    registratePersona(){
        this._router.navigate(['/tabs/registro-persona']);
    }

    async recuerarContrasenia() {
        // this._router.navigate(['/tabs/login/recuperar-contrasenia']);
        const modal = await this.modalController.create({
            component: RecuperarContraseniaPage
        });
        await modal.present();
    }

}
