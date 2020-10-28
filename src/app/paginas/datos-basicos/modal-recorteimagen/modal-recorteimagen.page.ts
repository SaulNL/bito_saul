import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import {ArchivoComunModel} from '../../../Modelos/ArchivoComunModel';
import { UtilsCls } from '../../../utils/UtilsCls';
import {DatosBasicosPage} from '../datos-basicos.page';
@Component({
  selector: 'app-modal-recorteimagen',
  templateUrl: './modal-recorteimagen.page.html',
  styleUrls: ['./modal-recorteimagen.page.scss'],
})
export class ModalRecorteimagenPage implements OnInit {
  imageChangedEvent: any = '';
  croppedImage: any = '';
  @Input() eventoImagen: any ;
  @Input() width: any ;
  @Input() height: any ;
  @Input() IdInput: any ;
  resizeToWidth: number = 0;
  resizeToHeight: number = 0;
  maintainAspectRatio: boolean = false;
  file_name: any;
  constructor(
    public modalController: ModalController,
    //public adminBasicos: DatosBasicosPage
  ) {

    
   }

  ngOnInit() {
    this.maintainAspectRatio = true;
    this.resizeToWidth = this.width;
    this.resizeToHeight = this.height;
    this.fileChangeEvent(this.eventoImagen);

  }

fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
}
imageCropped(image: any) {
    this.croppedImage = image.base64;
}
imageLoaded() {
    // show cropper
}
loadImageFailed() {
    // show message
}
guardarImagenRecortada(){
  for (const archivo of this.imageChangedEvent.target.files) {
    this.file_name = archivo.name;
  }
  this.modalController.dismiss({ 
  'data': this.croppedImage,
  'nombre_archivo': this.file_name
  });
}
cerraModal(){
this.modalController.dismiss();
var inputElement = <HTMLInputElement>document.getElementById(this.IdInput);
inputElement.value = '';
}
}
