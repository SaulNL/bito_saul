import { Component, OnInit, Input } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { NgForm } from "@angular/forms";
import { FormGroup } from "@angular/forms";
import { ToadNotificacionService } from "../../api/toad-notificacion.service";
import { NegocioService } from "../../api/negocio.service";
import { AlertController } from "@ionic/angular";

@Component({
  selector: "app-modal-clasificacion",
  templateUrl: "./modal-clasificacion.component.html",
  styleUrls: ["./modal-clasificacion.component.scss"],
})
export class ModalClasificacionComponent implements OnInit {
  @Input() public modalEditarCat: any;
  @Input() public datosNegocio: any;
  @Input() public listaVista: any;
  public nombreActual: string;
  public banderaGuardar: boolean;

  constructor(
    public modalController: ModalController,
    public notificacionService: ToadNotificacionService,
    private sercicioNegocio: NegocioService,
    public alertController: AlertController
  ) {}

  ngOnInit() {
    this.nombreActual = this.modalEditarCat.nombre;
  }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      dismissed: true,
    });
  }
  async presentAlert() {
    const alert = await this.alertController.create({
      header: "Desactivar categoría",
      message: `¿ Estás seguro de que deseas desactivar la categoria: ${this.nombreActual}? Se desactivarán todos los productos dentro de esta`,
      buttons: [
        {
          text: "Cancelar",
          role: "cancel",
          handler: () => {},
        },
        {
          text: "Aceptar",
          handler: () => {
            this.guardarCategoria();
          },
        },
      ],
    });

    await alert.present();
  }

  public guardar(form: NgForm) {
    if (form.invalid) {
      return Object.values(form.controls).forEach((control) => {
        if (control instanceof FormGroup) {
          Object.values(control.controls).forEach((con) => con.markAsTouched());
        } else {
          control.markAsTouched();
        }
      });
    } else {
      if (this.modalEditarCat.nombre === undefined) {
        this.notificacionService.error(
          "El nombre de la categoría es requerido"
        );
        return;
      }
      this.modalEditarCat.id_proveedor = this.datosNegocio.idProveedor;
      this.modalEditarCat.id_negocio = this.datosNegocio.id_negocio;

      if (this.modalEditarCat.activo === false) {
        this.presentAlert();
      }else{
        this.guardarCategoria();
      }
    }
  
  }
  async guardarCategoria() {

    this.sercicioNegocio.modificarCategoria(this.modalEditarCat).subscribe(
      (repsuesta) => {
        const categoriaMod = this.listaVista.find(
          (cat) => cat.id_categoria === this.modalEditarCat.id_categoria
        );
        categoriaMod.nombre = this.modalEditarCat.nombre;
        categoriaMod.activo = this.modalEditarCat.activo;
        if (repsuesta.code === 402) {
          this.notificacionService.alerta(repsuesta.message);
        }
        if (!this.modalEditarCat.activo) {
          if (
            categoriaMod.productos !== undefined &&
            categoriaMod.productos !== null
          ) {
            categoriaMod.productos.forEach((prod) => {
              prod.existencia = false;
            });
          }
        }

        this.notificacionService.exito("Se actualizó la categoría con éxito");
       this.dismiss();
        /*    this.sercicioNegocio
      .buscarProductosServios(this.modalEditarCat.id_negocio, 0)
      .subscribe(
        (respuesta) => {
         console.log("resp", respuesta)
         
        },
        (error) => {
          this.loader = false;
        }
      ); */
      },
      (error) => {
        this.notificacionService.error(
          "Ocurrio un error al actualizar la categoría, intenta más tarde"
        );
      },
      () => {
        this.banderaGuardar = false;
      }
    );
  }
}
