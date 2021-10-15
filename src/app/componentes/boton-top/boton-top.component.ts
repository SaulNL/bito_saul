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
  @Input() platform: boolean;
  constructor() {}

  ngOnInit() {

  }

  scrollToTop() {
    this.content.scrollToTop(500).then(r => {});
  }
  tipoDevice(){
    if(this.platform){
      return 'flotante-ios';
    } else {
      return 'flotante-android';
    }
  }
}
