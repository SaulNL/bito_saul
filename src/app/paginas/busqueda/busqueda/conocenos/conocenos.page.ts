import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-conocenos',
  templateUrl: './conocenos.page.html',
  styleUrls: ['./conocenos.page.scss'],
})
export class ConocenosPage implements OnInit {

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
