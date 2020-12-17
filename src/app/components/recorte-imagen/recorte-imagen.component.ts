import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UtilsCls } from '../../utils/UtilsCls';
import { ArchivoComunModel } from '../../Modelos/ArchivoComunModel';

@Component({
  selector: 'app-recorte-imagen',
  templateUrl: './recorte-imagen.component.html',
  styleUrls: ['./recorte-imagen.component.scss'],
  providers: [
    UtilsCls
  ]
})
export class RecorteImagenComponent implements OnInit {

  @Input() public imageChangedEvent: any;
  @Input() public resizeToWidth: number;
  @Input() public resizeToHeight: number;
  @Input() IdInput: any;
  public croppedImage: any = '';

  constructor(
    public modalController: ModalController,
    private _utils_cls: UtilsCls
  ) { 
  }

  ngOnInit() { }

  cerrar() {
    this.modalController.dismiss();
    var inputElement = <HTMLInputElement>document.getElementById(this.IdInput);
    inputElement.value = '';
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

  guardarImagenRecortada() {
    let name;
    for (const archivo of this.imageChangedEvent.target.files) {
      name = archivo.name;
    }
    this.modalController.dismiss({
      'data': this.croppedImage,
      'nombre_archivo': name
    });
  }
}
