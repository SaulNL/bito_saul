import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {RouteConfigLoadStart, RouteReuseStrategy} from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {HttpClientModule} from "@angular/common/http";
import { FormsModule } from '@angular/forms';

import { HaversineService } from "ng2-haversine";
import { Downloader} from '@ionic-native/downloader/ngx';
import {Platform} from "@ionic/angular";
import {HTTP} from "@ionic-native/http/ngx";

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule,HttpClientModule, IonicModule.forRoot(), AppRoutingModule, FormsModule],
  providers: [
    StatusBar,
    SplashScreen,
    HaversineService,
    { provide: RouteConfigLoadStart, useClass: IonicRouteStrategy },
    Downloader,
      Platform,
    HTTP
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
