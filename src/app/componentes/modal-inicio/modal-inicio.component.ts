import {Component, OnInit} from '@angular/core';
import {ModalController} from "@ionic/angular";

@Component({
  selector: 'app-modal-inicio',
  templateUrl: './modal-inicio.component.html',
  styleUrls: ['./modal-inicio.component.scss'],
})
export class ModalInicioComponent implements OnInit {

  constructor(
      public modalController: ModalController
  ) { }

  ngOnInit() {
    setTimeout(() => {
      this.modalController.dismiss();
    }, 8500);
  }

  /*
  getVideoDuration() {
    const video: HTMLVideoElement = this.videoElement.nativeElement;
    this.video = video.duration;
    console.log('Duración del video:', this.video);
  }

   */

  }
