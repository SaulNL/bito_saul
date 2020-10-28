import { Component, OnInit, Input } from '@angular/core';
import { FiltroCatPalabrasResModel } from "../../../../../Modelos/catalogos/FiltroCatPalabrasResModel";
import { AdministracionService } from "../../../../../api/administracion-service.service";
import { ToadNotificacionService } from "../../../../../api/toad-notificacion.service";
import {NgForm} from "@angular/forms";
import { ActionSheetController } from "@ionic/angular";
import { AlertController } from "@ionic/angular";
import {Router, ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-datos-palabra-reservadas',
  templateUrl: './datos-palabra-reservadas.page.html',
  styleUrls: ['./datos-palabra-reservadas.page.scss'],
})
export class DatosPalabraReservadasPage implements OnInit {
  public actualTO: FiltroCatPalabrasResModel;
  public palabraTO: FiltroCatPalabrasResModel;
  public activos = [
    {id: 0, activo: 'No'},
    {id: 1, activo: 'Si'},
  ];
  public valida: boolean;
  public botonAgregar: boolean;
  constructor(
    public actionSheetController: ActionSheetController,
    private  servicioAdmin: AdministracionService,
    private _notificacionService: ToadNotificacionService,
    public alertController: AlertController,
    private activatedRoute: ActivatedRoute,
    private router: Router
    
  ) {
    this.valida = false;
    this.botonAgregar = false;
   }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params && params.special) {
        this.actualTO = JSON.parse(params.special);
        this.palabraTO = this.actualTO;
        if (this.actualTO.id_palabra === null || this.actualTO.id_palabra === undefined) {
          this.botonAgregar=true;
        }else{
          this.botonAgregar=false;
        }
      }
    });
  }
  regresar() {
    this.router.navigate(['/tabs/home/cat-palabra-reservadas'], { queryParams: {special: true}  });
    //this.admin.blnActivaDatosPalabra = false;
    //this.btnAdd.botonAgregar = false;
  }
  actualizarDatos(form: NgForm) {
    if (this.palabraTO.activo === null) {
      this.palabraTO.activo = 0;
    }
    //this.loader = true;
    this.servicioAdmin.guardarPalabraReservada(this.palabraTO).subscribe(
      data => {
        if (data.code === 200) {
          //this.admin.getPalabras();
          this._notificacionService.exito('Los datos se guardaron correctamente');
          //this.loader = false;
          if (this.botonAgregar) {
            this.regresar();
          } else {
            this.valida = false;
          }
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
