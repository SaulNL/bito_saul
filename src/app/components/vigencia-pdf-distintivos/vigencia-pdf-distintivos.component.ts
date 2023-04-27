import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ArchivoComunModel } from 'src/app/Modelos/ArchivoComunModel';
import { ToadNotificacionService } from 'src/app/api/toad-notificacion.service';
import { UtilsCls } from 'src/app/utils/UtilsCls';
import moment from 'moment';

@Component({
  selector: 'app-vigencia-pdf-distintivos',
  templateUrl: './vigencia-pdf-distintivos.component.html',
  styleUrls: ['./vigencia-pdf-distintivos.component.scss'],
  providers: [
    UtilsCls
  ]
})
export class VigenciaPdfDistintivosComponent implements OnInit {

  @Input() distintivo: any;

  loaderPdf: boolean = false;
  carta: any

  constructor(
    private notificaciones: ToadNotificacionService, 
    private _utils_cls: UtilsCls, 
    private modalController: ModalController) { }

  ngOnInit() {
    alert(JSON.stringify(this.distintivo))    
  }

  abrirPdf() {
    if (this.distintivo.url_comprobante_vigencia != null) {
      window.open(this.distintivo.url_comprobante_vigencia, '_self')
    } else {
      this.notificaciones.alerta("Debe guardar el negocio para generar la url del pdf");
    }
  }

  subirCarta(event) {
    
    const fileName = event.target.files[0].name;
    const file = event.target.files[0];

    if (file.size < 5242880) {
      let file64: any;
      const utl = new UtilsCls();

      utl.getBase64(file).then((data) => {
        file64 = data;
        const archivo = new ArchivoComunModel();
        archivo.nombre_archivo = this._utils_cls.convertir_nombre(fileName);
        archivo.archivo_64 = file64;

        
        this.distintivo.archivo = archivo;
        console.log(this.distintivo)
      });
    } else {
      this.notificaciones.alerta("El archivo sobrepasa los 5 MB");
    }
  }

  cerrarModal() {
    this.modalController.dismiss();
  }

}
