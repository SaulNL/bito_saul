import { Component, Input, OnInit } from '@angular/core';
import { IonContent } from '@ionic/angular';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.page.html',
  styleUrls: ['./footer.page.scss'],
})
export class FooterPage implements OnInit {
  @Input() content: IonContent;
  @Input() cordenada: number;

  constructor() { }

  ngOnInit() {
  }

  public abrirTerminosCondiciones() {
    window.open("https://ecoevents.blob.core.windows.net/comprandoando/documentos%2FTERMINOS%20Y%20CONDICIONES%20Bitoo.pdf", "_blank");
  }

  scrollToTop() {
    this.content.scrollToTop();
  }

}
