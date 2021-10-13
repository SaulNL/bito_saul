import { Component, OnInit, Input } from '@angular/core';
import { IonContent } from '@ionic/angular';


@Component({
  selector: 'app-boton-top',
  templateUrl: './boton-top.component.html',
  styleUrls: ['./boton-top.component.scss'],
})
export class BotonTopComponent implements OnInit {
  @Input() content: IonContent;
  @Input() cordenada: number;
  constructor() {}

  ngOnInit() {
  }

  scrollToTop() {
    this.content.scrollToTop(500).then(r => {});
  }
}
