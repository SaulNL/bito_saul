import { Component, OnInit, Input } from '@angular/core';
import { FiltroCatPalabrasResModel } from "../../../../../Modelos/catalogos/FiltroCatPalabrasResModel";
import { AdministracionService } from "../../../../../api/administracion-service.service";
import { ToadNotificacionService } from "../../../../../api/toad-notificacion.service";
import { CatPalabraReservadasPage } from '../cat-palabra-reservadas.page';
import {NgForm} from "@angular/forms";
import { ActionSheetController } from "@ionic/angular";
import { AlertController } from "@ionic/angular";

@Component({
  selector: 'app-datos-palabra-reservadas',
  templateUrl: './datos-palabra-reservadas.page.html',
  styleUrls: ['./datos-palabra-reservadas.page.scss'],
})
export class DatosPalabraReservadasPage implements OnInit {
  @Input() public actualTO: FiltroCatPalabrasResModel;
  public palabraTO: FiltroCatPalabrasResModel;
  public activos = [
    {id: 0, activo: 'No'},
    {id: 1, activo: 'Si'},
  ];
  public valida: boolean;
  
  constructor(
    public actionSheetController: ActionSheetController,
    private  servicioAdmin: AdministracionService,
    private admin: CatPalabraReservadasPage,
    public btnAdd: CatPalabraReservadasPage,
    private _notificacionService: ToadNotificacionService,
    public alertController: AlertController
    
  ) {
    this.valida = false;
   }

  ngOnInit() {
    this.palabraTO = this.actualTO;
  }
  regresar() {
    this.admin.blnActivaDatosPalabra = false;
    this.btnAdd.botonAgregar = false;
  }
  actualizarDatos(form: NgForm) {
    if (this.palabraTO.activo === null) {
      this.palabraTO.activo = 0;
    }
    //this.loader = true;
    this.servicioAdmin.guardarPalabraReservada(this.palabraTO).subscribe(
      data => {
        if (data.code === 200) {
          this.admin.getPalabras();
          this._notificacionService.exito('Los datos se guardaron correctamente');
          //this.loader = false;
          this.regresar();
          //this.admin.activarTabla();
        } else {
          //this.loader = false;
          this._notificacionService.error(data.message);
        }
      },
      error => {
        this._notificacionService.error(error);
        //this.loader = false;
      },
      () => {
        //window.scrollTo({ top: 0, behavior: 'smooth' });
      }
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
  editarorno() {
    this.valida = true;
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
            this.eliminarPalabra();
          },
        },
      ],
    });
    await alert.present();
  }
  eliminarPalabra() {
   // this.loader = true;
    this.servicioAdmin.eliminarPalabraReservada(this.palabraTO.id_palabra).subscribe(
      response => {
        if (response.code === 200) {
          //this.loader = false;
          this.admin.getPalabras();
          //this.cancelarConfirmado();
          this._notificacionService.exito('se elimino correctamente');
          this.regresar();
        } else {
          //this.loader = false;
          //this.cancelarConfirmado();
          this._notificacionService.error(response.message);
        }
      },
      error => {
        this._notificacionService.error(error);
      }
    );
  }
}
