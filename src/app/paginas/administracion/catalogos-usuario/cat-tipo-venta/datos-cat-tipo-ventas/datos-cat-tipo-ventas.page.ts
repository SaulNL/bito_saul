import { Component, OnInit, Input } from "@angular/core";
import { CatTipoVentaPage } from "./../cat-tipo-venta.page";
import { NgForm } from "@angular/forms";
import { FiltroCatTipoVentaModel } from "../../../../../Modelos/catalogos/FiltroCatTipoVentaModel";
import { AdministracionService } from "../../../../../api/administracion-service.service";
import { ToadNotificacionService } from "../../../../../api/toad-notificacion.service";
import { UtilsCls } from "./../../../../../utils/UtilsCls";
import { ArchivoComunModel } from "./../../../../../Modelos/ArchivoComunModel";
import { ActionSheetController } from "@ionic/angular";
import { AlertController } from "@ionic/angular";

@Component({
  selector: "app-datos-cat-tipo-ventas",
  templateUrl: "./datos-cat-tipo-ventas.page.html",
  styleUrls: ["./datos-cat-tipo-ventas.page.scss"],
})
export class DatosCatTipoVentasPage implements OnInit {
  @Input() public actualTO: FiltroCatTipoVentaModel;
  public ventaTO: FiltroCatTipoVentaModel;
  public loaderCarga: boolean;
  private file_img_galeria: FileList;
  loader: boolean;
  public valida: boolean;
  public filtro: FiltroCatTipoVentaModel;
  public activos = [
    { id: 0, activo: "No" },
    { id: 1, activo: "Si" },
  ];
  constructor(
    public actionSheetController: ActionSheetController,
    private servicioUsuarios: AdministracionService,
    private admin: CatTipoVentaPage,
    public btnAdd: CatTipoVentaPage,
    public alertController: AlertController,
    private utilsCls: UtilsCls,
    public _notificacionService: ToadNotificacionService
  ) {
    this.valida = false;
  }
  regresar() {
    this.admin.blnActivaDatosTipoVenta = false;
    this.btnAdd.botonAgregar = false;
  }
  ngOnInit() {
    this.ventaTO = this.actualTO;
  }

  actualizarDatos(form: NgForm) {
    if (this.ventaTO.activo === null) {
      this.ventaTO.activo = 0;
    } else {
      if (this.ventaTO.activo) {
        this.ventaTO.activo = 1;
      } else{
        this.ventaTO.activo = 0;
      }
    }
    //this.loader = true;
    this.servicioUsuarios.guardarTipoVenta(this.ventaTO).subscribe(
      (data) => {
        if (data.code === 200) {
          this._notificacionService.exito(
            "Los datos se guardaron correctamente"
          );
          //this.loader = false;
          this.admin.getTipoVenta();
          this.admin.blnActivaDatosTipoVenta = false;
          // this.admin.activarTabla();
        } else {
          //this.loader = false;
          this._notificacionService.error(data.message);
        }
      },
      (error) => {
        this._notificacionService.error(error);
        //this.loader = false;
      },
      () => {
        //window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    );
  }
  buscarTipoNego() {
    this.servicioUsuarios.buscarTipoNego(this.actualTO.id_tipo_venta).subscribe(
      (respuesta) => {
        this.ventaTO = respuesta.data[0];
      },
      (error) => {
        console.log(error);
      },
      () => {}
    );
  }
  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: "Opciones",
      cssClass: "my-custom-class",
      buttons: [
        {
          text: "Borrar",
          role: "destructive",
          handler: () => {
            this.presentAlertMultipleButtons();
          },
        },
        {
          text: "Editar",
          role: "edit",
          handler: () => {
            this.editarorno();
          },
        },
        {
          text: "Cancel",
          icon: "close",
          role: "cancel",
          handler: () => {},
        },
      ],
    });
    await actionSheet.present();
  }
  async presentAlertMultipleButtons() {
    const alert = await this.alertController.create({
      cssClass: "my-custom-class",
      header: "Borrar",
      message: "Confirmar borrar variable",
      buttons: [
        {
          text: "Cancelar",
          role: "No",
          handler: (blah) => {},
        },
        {
          text: "Confirmar",
          role: "Si",
          handler: (blah) => {
            this.eliminarTipoVenta();
          },
        },
      ],
    });
    await alert.present();
  }

  editarorno() {
    this.valida = true;
  }

  public subirArchivo(event) {
    if (event.target.files && event.target.files.length) {
      let height;
      let width;
      for (const archivo of event.target.files) {
        const reader = new FileReader();
        reader.readAsDataURL(archivo);
        reader.onload = () => {
          const img = new Image();
          img.src = reader.result as string;
          img.onload = () => {
            height = img.naturalHeight;
            width = img.naturalWidth;
            const file_name = archivo.name;
            const file = archivo;
            if (file.size < 3145728) {
              let file_64: any;
              const utl = new UtilsCls();
              utl.getBase64(file).then((data) => {
                const archivo = new ArchivoComunModel();
                if (file_name != null) {
                  archivo.nombre_archivo = this.utilsCls.convertir_nombre(
                    file_name
                  );
                  archivo.archivo_64 = data;
                }
                this.ventaTO.icono = archivo;
              });
            } else {
              this._notificacionService.alerta(
                "El tama\u00F1o m\u00E1ximo de archivo es de 3 Mb, por favor intente con otro archivo"
              );
              // this.notificacionService.pushAlert('comun.file_sobrepeso');
            }
          };
        };
      }
    }
  }
  eliminarTipoVenta() {
    this.loader = true;
    this.servicioUsuarios.eliminarTipoVenta(this.ventaTO.id_tipo_venta).subscribe(
      response => {
        if (response.code === 200) {
          //this.loader = false;
          this._notificacionService.exito('Se elimino correctamente');
          this.admin.getTipoVenta();
          this.regresar();
        } else {
          //this.loader = false;
          this._notificacionService.alerta(response.message);
        }
      },
      error => {

        this._notificacionService.error(error);
      }
    );
  }
}
