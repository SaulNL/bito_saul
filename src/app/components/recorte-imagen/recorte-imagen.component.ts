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

  @Input() public actualTo: any;
  @Input() public imageChangedEvent: any;
  @Input() public maintainAspectRatio: boolean;
  @Input() public resizeToWidth: number;
  @Input() public resizeToHeight: number;
  @Input() public tipoImagen: number;
  @Input() public blnImgCuadrada: boolean;
  @Input() public blnImgRectangulo: boolean;
  @Input() public blnImgPoster: boolean;
  @Input() public procesando_img: boolean;
  public croppedImage: any = '';

  constructor( public modalController: ModalController,
               private _utils_cls: UtilsCls 
              ) { }

  ngOnInit() {}

  dismiss() {
    this.modalController.dismiss({
      'dismissed': true,
      'data': this.actualTo
    });
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
      const file_name = archivo.name;
      const file = archivo;
      if (file.size < 3145728) {
        let file_64: any;
        const utl = new UtilsCls();
        utl.getBase64(file).then(
          data => {
            file_64 = data;
            const imagen = new ArchivoComunModel();
            imagen.nombre_archivo = this._utils_cls.convertir_nombre(file_name);
            imagen.archivo_64 = this.croppedImage;
            switch (this.tipoImagen) {
              case 1:
                this.actualTo.imagen = imagen;
                this.blnImgCuadrada = false;
                break;
              case 2:
                this.actualTo.imagenBanner = imagen;
                this.blnImgRectangulo = false;
                break;
              case 3:
                this.actualTo.imagenPoster = imagen;
                this.blnImgPoster = false;
                break;
            }
            this.procesando_img = false;
          }
        );
      }
    }
    this.dismiss();
  }

}
