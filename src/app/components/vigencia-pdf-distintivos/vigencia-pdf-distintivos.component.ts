import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ArchivoComunModel } from 'src/app/Modelos/ArchivoComunModel';
import { ToadNotificacionService } from 'src/app/api/toad-notificacion.service';
import { UtilsCls } from 'src/app/utils/UtilsCls';
import { FilePicker } from '@capawesome/capacitor-file-picker';

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
  public pdfBg: string;

  constructor(
    private notificaciones: ToadNotificacionService,
    private _utils_cls: UtilsCls,
    private modalController: ModalController) { }

  ngOnInit() {
    this.pdfBg = this.distintivo.url_comprobante_vigencia != null || this.distintivo.archivo != null ? "#00b347" : "#df5555";
    this.distintivo.fc_vencimiento = this.distintivo.fc_vencimiento !== null ? new Date(this.distintivo.fc_vencimiento).toISOString() : null;
  }

  abrirPdf() {

    if (this.distintivo.url_comprobante_vigencia != null && this.distintivo.archivo === undefined) {
      window.open(this.distintivo.url_comprobante_vigencia, '_blank');
    } else {
      this.notificaciones.alerta("Asegúrese de agregar un pdf y luego guarde el negocio para generar la url");
    }
  }

  async selectPDF() {
    let result = null;
    result = await FilePicker.pickFiles({
      types: ['application/pdf'],
      multiple: false,
      readData: true
    });

    let file = result.files[0];

    if (file.size < 5242880) {
      const archivo = new ArchivoComunModel();
      archivo.nombre_archivo = file.name;
      archivo.archivo_64 = 'data:application/pdf;base64,' + file.data;
      
      this.distintivo.archivo = archivo;
      this.pdfBg = this.distintivo.url_comprobante_vigencia != null || this.distintivo.archivo != null ? "#00b347" : "#df5555";
      this.notificaciones.toastSuccessBottom("¡Archivo agregado con exito!");

    } else {
      this.notificaciones.toastWarningBottom("El archivo sobrepasa los 5 MB");
    }
  }

  /* subirCarta(event) {

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
        this.pdfBg = this.distintivo.url_comprobante_vigencia != null || this.distintivo.archivo != null ? "#00b347" : "#df5555";
        this.notificaciones.success("¡Archivo agregado con exito!");

      });
    } else {
      this.notificaciones.alerta("El archivo sobrepasa los 5 MB");
    }
  } */

  eliminarCarta() {
    if (this.distintivo.url_comprobante_vigencia) delete this.distintivo.url_comprobante_vigencia;
    if (this.distintivo.archivo) delete this.distintivo.archivo;
    this.pdfBg = this.distintivo.url_comprobante_vigencia != null || this.distintivo.archivo != null ? "#00b347" : "#df5555";
  }

  cerrarModal() {
    this.modalController.dismiss();
  }

  selectFechaVencimiento(event: any) {
    let fecha = event.detail.value;
    let ms = Date.parse(fecha);
    fecha = new Date(ms).toISOString();
    this.distintivo.fc_vencimiento = fecha;
  }

}
