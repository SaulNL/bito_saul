import {Injectable, Injector} from '@angular/core';
import {HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpHeaders} from '@angular/common/http';
import {Observable, from} from 'rxjs';
import {Platform} from '@ionic/angular';
import {HTTP} from '@ionic-native/http/ngx';

type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'head' | 'delete' | 'upload' | 'download';

@Injectable()
export class NativeHttpInterceptor implements HttpInterceptor {
  constructor(
    private injector: Injector
  ) {
  }

  public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // if (!this.platform.is('cordova') || !this.platform.is('android') || !this.platform.is('ios')) {
    //   return next.handle(request);
    // }

    return from(this.handleNativeRequest(request));
  }

  private async handleNativeRequest(request: HttpRequest<any>): Promise<HttpResponse<any>> {

    console.log('entrando');

    const headerKeys = request.headers.keys();
    const headers = {};

    headerKeys.forEach((key) => {
      headers[key] = request.headers.get(key);
    });

    try {const nativeHttp = this.injector.get(HTTP);
      const platform = this.injector.get(Platform);

      await platform.ready();
      const method = <HttpMethod> request.method.toLowerCase();

      console.log('— Request url');
      console.log(request.url);
      console.log('— Request body');
      console.log(request.body);

      let bodyRequest = {};
      try {
        if (request.body !== undefined && request.body !== null) {
          bodyRequest = JSON.parse(request.body);

          if (bodyRequest === null) {
            bodyRequest = {};
          }
        }
      } catch (error) {
        console.log(error);
        bodyRequest = {};
      }

      const nativeHttpResponse = await nativeHttp.sendRequest(request.url, {
        method: method,
        data: bodyRequest,
        headers: headers,
        serializer: 'json',
      });

      let body;

      try {
        body = JSON.parse(nativeHttpResponse.data);
      } catch (error) {
        console.log(error);
        body = {response: nativeHttpResponse.data};
      }

      const response = new HttpResponse({
        body: body,
        headers: new HttpHeaders(nativeHttpResponse.headers),
        status: nativeHttpResponse.status,
        url: nativeHttpResponse.url,
      });

      console.log('— Response success');
      console.log(response);

      return Promise.resolve(response);
    } catch (error) {
      console.log(error);
      if (!error.status) {
        return Promise.reject(error);
      }

      const response = new HttpResponse({
        body: JSON.parse(error.error),
        status: error.status,
        headers: error.headers,
        url: error.url,
      });

      console.log('— Response success');
      console.log(response);

      return Promise.reject(response);
    }
  }
}
