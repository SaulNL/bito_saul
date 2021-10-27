import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ResponderLogin} from "../../Modelos/ResponderLogin";
import {Facebook, FacebookLoginResponse} from "@ionic-native/facebook/ngx";
import {AngularFireAuth} from "@angular/fire/auth";
import {GooglePlus} from "@ionic-native/google-plus/ngx";
import * as firebase from "firebase";
import {Platform} from "@ionic/angular";
import {SignInWithApple, ASAuthorizationAppleIDRequest, AppleSignInResponse, AppleSignInErrorResponse} from "@ionic-native/sign-in-with-apple/ngx";

@Component({
    selector: 'app-login-social-networks',
    templateUrl: './login-social-networks.component.html',
    styleUrls: ['./login-social-networks.component.scss'],
})
export class LoginSocialNetworksComponent implements OnInit {
    private response: ResponderLogin;
    @Output() responseLogin: EventEmitter<any> = new EventEmitter();
    private responseGoogle: any;
    public isIOS: boolean;

    constructor(
        private facebook: Facebook,
        private angularFireAuth: AngularFireAuth,
        private googlePlus: GooglePlus,
        private platform: Platform,
        private signInWithApple: SignInWithApple
    ) {
        this.isIOS = this.platform.is('ios');
    }

    ngOnInit() {
    }


    async loginWithFacebook() {
        try {
            const responseFacebook: FacebookLoginResponse = await this.facebook.login([
                "public_profile",
                "email",
            ]);
            const facebookCredentials = firebase.auth.FacebookAuthProvider.credential(
                responseFacebook.authResponse.accessToken
            );

            const responseCredentialsFacebook = await this.angularFireAuth.auth.signInWithCredential(
                facebookCredentials
            );
            await this.facebook.logout();
            this.responderSuccess(responseCredentialsFacebook);
        } catch (e) {
            this.errorFacebook();
        }
    }

    async loginWithGoogle() {
        try {
            if (this.platform.is("android")) {
                this.responseGoogle = await this.googlePlus.login({
                    webClientId: "315189899862-5hoe16r7spf4gbhik6ihpfccl4j9o71l.apps.googleusercontent.com",
                    offline: true
                });
            } else if (this.platform.is("ios")) {
                this.responseGoogle = await this.googlePlus.login({
                    webClientId: "315189899862-qtgalndbmc8ollkjft8lnpuboaqap8sa.apps.googleusercontent.com",
                    offline: true
                });

                const responseCredentialsGoogle = await this.angularFireAuth.auth.signInWithCredential(
                    firebase.auth.GoogleAuthProvider.credential(this.responseGoogle.idToken)
                );
                this.responderSuccess(responseCredentialsGoogle);
            } else {
                this.errorGoogle();
            }
        } catch
            (e) {
            this.errorGoogle();
        }
    }
    async loginAppleId(){
        try{
            this.signInWithApple.signin({
                requestedScopes: [
                    ASAuthorizationAppleIDRequest.ASAuthorizationScopeFullName,
                    ASAuthorizationAppleIDRequest.ASAuthorizationScopeEmail
                ]
            })
                .then((res: AppleSignInResponse) => {
                    if (res.email !== '' || res.email.length > 0){
                        this.responderSuccess(res, true);
                    }else{
                        this.errorAppleID();
                    }
                    console.log(JSON.stringify(res));
                })
                .catch((error: AppleSignInErrorResponse) => {
                    this.errorAppleID();
                    console.error(JSON.stringify(error));
                });
        }catch (error){
            this.errorAppleID();
        }
    }


    private responderSuccess(credentials: any, isAppleID = false) {
        this.response = new ResponderLogin();
        this.response.responder = 'success';
        this.response.body = credentials;
        this.response.isAppleID = isAppleID;
        this.responseLogin.emit(this.response);
    }

    private errorGoogle() {
        this.responderError('Google');
    }

    private errorFacebook() {
        this.responderError('Facebook');
    }

    private errorAppleID() {
        this.responderError('Apple ID');
    }

    private responderError(typeConnection: string) {
        this.response = new ResponderLogin();
        this.response.responder = 'error';
        this.response.notification = 'Se perdió la conexión con el servidor de ' + typeConnection;
        this.responseLogin.emit(this.response);
    }
}
