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
        private inicioPage: InicioPage,
        private auth0: Auth0Service
    ) {
        this.existeSesion = util.existe_sesion();
    }

    ngOnInit(): void {
        this.sideBarService.getObservable().subscribe((data) => {
            this.usuario = this.util.getData();
        });
        this.sideBarService.change.subscribe(isOpen => {
            this.usuario = this.auth0.getUserData();
          })
        this.usuario = this.util.getData();


    }

    inicio() {
        // localStorage.setItem('isRedirected', 'false');
        this.router.navigate(['/tabs/inicio']);
        this.inicioPage.buscarNegocios()
        localStorage.setItem('resetFiltro', '0');
    }

    promociones() {
        this.router.navigate(['/tabs/promociones']);
        localStorage.setItem('resetFiltro', '0');
    }
    solicitudes(){
        this.router.navigate(['/tabs/mis-favoritos']);
        // this.router.navigate(['/tabs/home/solicitud']);
    }

    productos() {
         this.router.navigate(['/tabs/productos']);
         localStorage.setItem('resetFiltro', '0');

    }
    perfil(){
        // localStorage.setItem('isRedirected', 'false');
        localStorage.setItem('resetFiltro', '0');
        this.router.navigate(['/tabs/home/perfil'], { queryParams: {special: true}  });
    }
}
