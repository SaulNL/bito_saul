import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { UtilsCls } from "../../utils/UtilsCls";
import {AppSettings} from "../../AppSettings";

@Component({
  selector: 'app-ajustes',
  templateUrl: './ajustes.page.html',
  styleUrls: ['./ajustes.page.scss'],
  providers: [
    UtilsCls
  ]
})
export class AjustesPage implements OnInit {
  usuario: any;
  public url_user: string;
  constructor(
    private util: UtilsCls
  ) { }

  ngOnInit() {
    this.usuario = this.util.getData();
    this.url_user = AppSettings.API_ENDPOINT + 'img/user.png';
  }

}
