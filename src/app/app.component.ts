import { Component } from '@angular/core';

import { NavController, Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Deeplinks } from '@ionic-native/deeplinks/ngx';
import { Router } from '@angular/router';
import { NgZone } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private deeplinks: Deeplinks,
    private router: Router,
    private zone: NgZone,
    private navController: NavController

  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.setupDeeplinks();
    });
  }

  setupDeeplinks() {
    this.deeplinks.routeWithNavController(this.navController, {}).subscribe(
      (match) => {
        console.log('Successfully matched route');
        const url:any = match.$link["url"].split("/");
        if(url[2] === match.$link["host"]){
          this.zone.run(() => {
            this.router.navigateByUrl('/tabs/negocio'+match.$link["path"]);
          });
        }        
       }, (nomatch) => {
        console.error('Got a deeplink that didn\'t match', nomatch);
       });
  }

}
