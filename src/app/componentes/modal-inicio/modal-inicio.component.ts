import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ModalController} from "@ionic/angular";

@Component({
  selector: 'app-modal-inicio',
  templateUrl: './modal-inicio.component.html',
  styleUrls: ['./modal-inicio.component.scss'],
})
export class ModalInicioComponent implements OnInit {
  @ViewChild('videoElement') videoElement: ElementRef;
  video: any;

  constructor(
      public modalController: ModalController
  ) { }

  ngOnInit() {
    setTimeout(() => {
      const loaderVideo = false;
      this.modalController.dismiss({returnedBoolean: loaderVideo});
    }, 12000);
  }

  /*
  getVideoDuration() {
    const video: HTMLVideoElement = this.videoElement.nativeElement;
    this.video = video.duration;
    console.log('Duración del video:', this.video);
  }

   */

  }
