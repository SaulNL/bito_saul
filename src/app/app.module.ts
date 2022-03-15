import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteConfigLoadStart, RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from '@angular/forms';

import { HaversineService } from "ng2-haversine";
import { Downloader } from '@ionic-native/downloader/ngx';
import { Platform } from "@ionic/angular";
import { HTTP } from "@ionic-native/http/ngx";
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Facebook } from '@ionic-native/facebook/ngx';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { firebaseConfig } from '../environments/environment';
import { File } from '@ionic-native/file/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Deeplinks } from '@ionic-native/deeplinks/ngx';
import { SignInWithApple } from '@ionic-native/sign-in-with-apple/ngx';
import { LocalNotifications} from '@ionic-native/local-notifications/ngx'

import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, HttpClientModule, IonicModule.forRoot(), AppRoutingModule, FormsModule, AngularFireModule.initializeApp(firebaseConfig), AngularFireAuthModule],
  providers: [
    LocalNotifications,
    StatusBar,
    SplashScreen,
    HaversineService,
    Downloader,
    Platform,
    HTTP,
    GooglePlus,
    Facebook,
    File,
    Geolocation,
    SocialSharing,
    { provide: RouteConfigLoadStart, useClass: IonicRouteStrategy },
    Deeplinks,
    SignInWithApple
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
