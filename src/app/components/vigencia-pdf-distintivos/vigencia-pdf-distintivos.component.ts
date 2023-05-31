import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ArchivoComunModel } from 'src/app/Modelos/ArchivoComunModel';
import { ToadNotificacionService } from 'src/app/api/toad-notificacion.service';
import { UtilsCls } from 'src/app/utils/UtilsCls';

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
  }

  abrirPdf() {

    if (this.distintivo.url_comprobante_vigencia != null && this.distintivo.archivo === undefined) {
      window.open(this.distintivo.url_comprobante_vigencia, '_blank');
    } else {
      this.notificaciones.alerta("Asegúrese de agregar un pdf y luego guarde el negocio para generar la url");
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
        this.notificaciones.success("¡Archivo agregado con exito!");

      });
    } else {
      this.notificaciones.alerta("El archivo sobrepasa los 5 MB");
    }
  }

  cerrarModal() {
    this.modalController.dismiss();
  }

}
