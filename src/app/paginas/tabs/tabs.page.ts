import { Component } from '@angular/core';
import {UtilsCls} from "../../utils/UtilsCls";

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  providers: [
      UtilsCls
  ]
})
export class TabsPage {
  existeSesion: boolean
  usuario: any
  constructor(
      private util: UtilsCls
  ) {
    this.existeSesion = util.existe_sesion()
    this.usuario = util.getData();
  }

}
