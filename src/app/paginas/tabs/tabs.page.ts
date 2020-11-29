import {Component, OnInit} from '@angular/core';
import {UtilsCls} from "../../utils/UtilsCls";
import {SideBarService} from "../../api/busqueda/side-bar-service";
import {Auth0Service} from "../../api/busqueda/auth0.service";
import {Router} from "@angular/router";
import {InicioPage} from "../inicio/inicio.page";

@Component({
    selector: 'app-tabs',
    templateUrl: 'tabs.page.html',
    styleUrls: ['tabs.page.scss'],
    providers: [
        UtilsCls,
        SideBarService,
        Auth0Service,
        InicioPage
    ]
})
export class TabsPage implements OnInit{
    existeSesion: boolean
    usuario: any

    constructor(
        private util: UtilsCls,
        private sideBarService: SideBarService,
        private router:Router,
        private inicioPage: InicioPage
    ) {
        this.existeSesion = util.existe_sesion();
    }

    ngOnInit(): void {
        this.sideBarService.getObservable().subscribe((data) => {
            this.usuario = this.util.getData();
        });
        this.usuario = this.util.getData();
        
    }

    inicio() {
        this.router.navigate(['/tabs/inicio']);
        this.inicioPage.buscarNegocios()
    }

    promociones() {
        this.router.navigate(['/tabs/promociones']);
        
    }

    productos() {
         this.router.navigate(['/tabs/productos']);
         
    }
    perfil(){        
        sessionStorage.setItem('isRedirected', 'false');
        console.log(sessionStorage.getItem('isRedirected'));
        this.router.navigate(['/tabs/home/perfil'], { queryParams: {special: true}  });
    }
}
