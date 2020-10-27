import {Injectable} from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SideBarService {
  private fooSubject = new Subject<any>();

  publishSomeData(data: any) {
    console.log('setando')
    this.fooSubject.next(data);
  }

  getObservable(): Subject<any> {
    console.log('obteniendo')
    return this.fooSubject;
  }
}
