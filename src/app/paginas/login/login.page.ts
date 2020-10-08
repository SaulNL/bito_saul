import {Component, OnInit} from '@angular/core';
import {Login} from "../../Modelos/login";
import {LoginService} from "../../api/login.service";
import {AppSettings} from "../../AppSettings";
import {Location} from '@angular/common';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

    public usuario: Login;
    public loader: boolean;

    constructor(
        private loginService: LoginService,
        private location: Location
    ) {
        this.loader = false;
        this.usuario = new Login();
    }

    ngOnInit(): void {
    }

    doLogin() {
        this.loader = true;
        this.loginService.login(this.usuario).subscribe(
            respuesta =>{
                AppSettings.setTokenUser(respuesta);
                this.loader = false;
                const elemento = document.querySelector('ion-back-button');
                elemento.click()
            },error => {}
        );
    }
}
