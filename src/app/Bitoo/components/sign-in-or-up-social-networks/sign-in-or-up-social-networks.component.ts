import { Constant } from './../../environments/contant';
import { ResponderInterface, ResponderModel } from './../../models/responder-model';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Facebook, FacebookLoginResponse } from "@ionic-native/facebook/ngx";
import * as firebase from 'firebase/app';
import 'firebase/auth';
import { AngularFireAuth } from "@angular/fire/auth";
import { GooglePlus } from "@ionic-native/google-plus/ngx";
import { AppleSignInErrorResponse, AppleSignInResponse, ASAuthorizationAppleIDRequest, SignInWithApple } from "@ionic-native/sign-in-with-apple/ngx";

@Component({
  selector: 'app-sign-in-or-up-social-networks',
  templateUrl: './sign-in-or-up-social-networks.component.html',
  styleUrls: ['./sign-in-or-up-social-networks.component.scss'],
})
export class SignInOrUpSocialNetworksComponent implements OnInit {
  @Input() public ios: boolean;
  @Input() public signIn: boolean;
  @Input() public loaderFacebook: boolean;
  @Input() public loaderGoogle: boolean;
  @Input() public loaderApple: boolean;
  @Output() public responder: EventEmitter<any> = new EventEmitter();

  constructor(
    private facebook: Facebook,
    private angularFireAuth: AngularFireAuth,
    private googlePlus: GooglePlus,
    private signInWithApple: SignInWithApple
  ) {}

  ngOnInit() {
  }

  async signUpFacebook() {
    this.loaderFacebook = true;
    const response: ResponderInterface = new ResponderModel('facebook');
    try {
      const permissions: Array<string> = ["public_profile", "email"];
      const responseFacebook: FacebookLoginResponse = await this.facebook.login(permissions);
      const credentialsFacebook: firebase.auth.OAuthCredential = firebase.auth.FacebookAuthProvider.credential(responseFacebook.authResponse.accessToken);
      response.credentials = await this.angularFireAuth.auth.signInWithCredential(credentialsFacebook);
      this.facebook.logout();
      this.responder.emit(response);
    } catch (error) {
      response.isSuccess = 'error';
      response.credentials = error;
      this.responder.emit(response);
      this.loaderFacebook = false;
    }
  }

  async signUpGoogle() {
    this.loaderGoogle = true;
    const response: ResponderInterface = new ResponderModel('google');
    try {
      if (this.ios) {
        const responseGoogleApple = await this.googlePlus.login({ webClientId: Constant.GOOGLE_KEY_APPLE, offline: true });
        this.proccessAfterSignUpGoogle(responseGoogleApple, response);
      } else {
        const responseGoogleAndroid = await this.googlePlus.login({ webClientId: Constant.GOOGLE_KEY_ANDROID, offline: true });
        this.proccessAfterSignUpGoogle(responseGoogleAndroid, response);
      }
    } catch (error) {
      response.isSuccess = 'error';
      response.credentials = error;
      this.responder.emit(response);
      this.loaderGoogle = false;
    }
  }

  async proccessAfterSignUpGoogle(responseGoogle: any, response: ResponderModel) {
    const credentialsGoogle = await this.angularFireAuth.auth.signInWithCredential(
      firebase.auth.GoogleAuthProvider.credential(responseGoogle.idToken)
    );
    response.credentials = credentialsGoogle;
    this.responder.emit(response);
  }

  public signUpApple() {
    this.loaderApple = true;
    const response: ResponderInterface = new ResponderModel('apple');
    try {
      this.signInWithApple.signin({
        requestedScopes: [
          ASAuthorizationAppleIDRequest.ASAuthorizationScopeFullName,
          ASAuthorizationAppleIDRequest.ASAuthorizationScopeEmail
        ]
      }).then((credentialsGoogle: AppleSignInResponse) => {
        response.credentials = credentialsGoogle;
        this.responder.emit(response);
      }).catch((error: AppleSignInErrorResponse) => {
        response.isSuccess = 'error';
        response.credentials = error;
        this.responder.emit(response);
      });
    } catch (error) {
      response.isSuccess = 'error';
      response.credentials = error;
      this.responder.emit(response);
      this.loaderApple = false;
    }
  }

  get isSignIn() {
    return (this.signIn);
  }
}
