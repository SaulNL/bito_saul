import {Component, OnInit} from '@angular/core';
import {Login} from "../../Modelos/login";
import {LoginService} from "../../api/login.service";
import {AppSettings} from "../../AppSettings";
import {Location} from '@angular/common';
import {SessionUtil} from "../../utils/sessionUtil";
import {SideBarService} from "../../api/busqueda/side-bar-service";
import {NavController} from "@ionic/angular";
import {Router} from "@angular/router";

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
                const actualizado = AppSettings.setTokenUser(respuesta);
                // this.sideBarService.actualizarSide();
                // this.loader = false;
                this.sideBarService.publishSomeData('');
                this.navctrl.back()
            }, error => {
            }
        );
    }

    recuerarContrasenia(){
      this._router.navigate(['/tabs/login/recuperar-contrasenia']);
    }

}
