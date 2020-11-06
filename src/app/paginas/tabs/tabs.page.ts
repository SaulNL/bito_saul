import {Component, OnInit} from '@angular/core';
import {UtilsCls} from "../../utils/UtilsCls";
import {SideBarService} from "../../api/busqueda/side-bar-service";
import {Auth0Service} from "../../api/busqueda/auth0.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-tabs',
    templateUrl: 'tabs.page.html',
    styleUrls: ['tabs.page.scss'],
    providers: [
        UtilsCls,
        SideBarService,
        Auth0Service
    ]
})
export class TabsPage implements OnInit{
    existeSesion: boolean
    usuario: any

    constructor(
        private util: UtilsCls,
        private sideBarService: SideBarService,
        private router:Router,
    ) {
        this.existeSesion = util.existe_sesion();
    }

    ngOnInit(): void {
        console.log(sessionStorage.getItem('isRedirected'));
        this.sideBarService.getObservable().subscribe((data) => {
            this.usuario = this.util.getData();
        });
        this.usuario = this.util.getData();
        
    }

    inicio() {
        this.router.navigate(['/tabs/inicio'], { queryParams: {special: true}  });
        console.log(sessionStorage.getItem('isRedirected'));
        
    }

    promociones() {
        this.router.navigate(['/tabs/promociones'], { queryParams: {special: true}  });
        console.log(sessionStorage.getItem('isRedirected'));
        
    }

    productos() {
         this.router.navigate(['/tabs/productos'], { queryParams: {special: true}  });
         console.log(sessionStorage.getItem('isRedirected'));
         
    }
    perfil(){        
        sessionStorage.setItem('isRedirected', 'false');
        console.log(sessionStorage.getItem('isRedirected'));
        this.router.navigate(['/tabs/home/perfil'], { queryParams: {special: true}  });
    }
}
