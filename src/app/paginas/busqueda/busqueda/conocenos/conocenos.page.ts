import { Component, OnInit, ViewChild } from '@angular/core';
import {Router} from "@angular/router";
import { IonContent } from '@ionic/angular';

@Component({
  selector: 'app-conocenos',
  templateUrl: './conocenos.page.html',
  styleUrls: ['./conocenos.page.scss'],
})
export class ConocenosPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  public cordenada: number;


  constructor(
    private _router: Router
  ) { }

  ngOnInit() {
  }

  rutaLink(ruta: string) {
    this._router.navigateByUrl('#' + ruta, {skipLocationChange: true});
    setTimeout(() => this._router.navigate([ruta]));
  }
}
