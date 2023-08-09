import { Component, Input, OnInit } from '@angular/core';
import { IonContent } from '@ionic/angular';
import {AppSettings} from "../../../AppSettings";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.page.html',
  styleUrls: ['./footer.page.scss'],
})
export class FooterPage implements OnInit {
  @Input() content: IonContent;
  @Input() cordenada: number;
  public URL_FRONT = AppSettings.URL_FRONT;

  constructor() { }

  ngOnInit() {
  }

  public abrirTerminosCondiciones() {
    window.open(
        this.URL_FRONT + "politica/privacidad",
        "_blank"
    );
  }

  scrollToTop() {
    this.content.scrollToTop();
  }

}
