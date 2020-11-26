import { Component, OnInit, Input } from "@angular/core";
import { FiltroCatRolModel } from "../../../../../Modelos/catalogos/FiltroCatRolModel";
import { AdministracionService } from "../../../../../api/administracion-service.service";
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from "@angular/forms";
import { AlertController } from "@ionic/angular";
import { ActionSheetController } from "@ionic/angular";
import { ToadNotificacionService } from "../../../../../api/toad-notificacion.service";

@Component({
  selector: "app-datos-cat-rol",
  templateUrl: "./datos-cat-rol.page.html",
  styleUrls: ["./datos-cat-rol.page.scss"],
})
export class DatosCatRolPage implements OnInit {
  public selectTO: FiltroCatRolModel;
  public variableTO: FiltroCatRolModel;
  public valida: boolean;
  public isToggled: boolean;
  public filtro: FiltroCatRolModel;
  public activos = [
    { id: 0, activo: "No" },
    { id: 1, activo: "Si" },
  ];
  public lstCatPermisos: Array<any>;
  public blnBtnPermisos: boolean;
  public botonAgregar: boolean;
  public actualTO: FiltroCatRolModel;

  constructor(
    public actionSheetController: ActionSheetController,
    public alertController: AlertController,
    private notificaciones: ToadNotificacionService,
    private servicioUsuarios: AdministracionService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.variableTO = new FiltroCatRolModel();
    this.valida = false;
    this.isToggled = false;
    this.botonAgregar = false;
  }
  public notify() {
    let permisoSeleccionado = this.variableTO.permisos.filter(function (
      permiso
    ) {
      return permiso.estaSeleccionado === true;
    });
    if (permisoSeleccionado.length > 0) {
      this.blnBtnPermisos = true;
    } else {
      this.blnBtnPermisos = false;
    }
  }
  regresar() {
    this.router.navigate(['/tabs/home/cat-rol'], { queryParams: { special: true } });
    //this.admin.blnActivaDatosRol = false;
    //this.btnAdd.botonAgregar = false;
  }
  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params && params.special) {
        this.actualTO = JSON.parse(params.special);
        if (this.actualTO.id_rol === null || this.actualTO.id_rol === undefined) {
          this.botonAgregar = true;
        } else {
          this.botonAgregar = false;
        }
      }
    });
    this.rolPermisos();
    this.getPermiso();
  }
  rolPermisos() {
    if (this.actualTO.id_rol === null || this.actualTO.id_rol === undefined) {
      this.variableTO = this.actualTO;
    } else {
      this.buscarRol();
      this.blnBtnPermisos = true;
    }
  }

  editarorno() {
    this.valida = true;
  }
  buscarRol() {
    // this.loaderGiro = true;
    this.servicioUsuarios.buscarRol(this.actualTO.id_rol).subscribe(
      (respuesta) => {
        //   this.loaderGiro = false;
        this.variableTO = respuesta.data;
        this.getPermiso();
        // console.log(this.rolTO);
      },
      (error) => {
        //console.log(error);
      },
      () => { }
    );
  }
  getPermiso() {
    //this.loaderGiro = true;
    this.servicioUsuarios.listarPermiso().subscribe(
      (response) => {
        //this.loaderGiro = false;
        this.lstCatPermisos = response.data;
        if (
          this.actualTO.id_rol === null ||
          this.actualTO.id_rol === undefined
        ) {
          this.variableTO.permisos = this.lstCatPermisos;
        }
      },
      (error) => {
        this.notificaciones.error("Error");
      }
    );
  }
  actualizarDatos() {
    if(this.variableTO.activo === null){
      this.variableTO.activo = 0;
    }
    this.servicioUsuarios.guardarRol(this.variableTO).subscribe(
      (data) => {
        if (data.code === 200) {
          this.notificaciones.exito("Los datos se guardaron correctamente");
          this.regresar();
        } else {
          this.notificaciones.alerta(data.message);
        }
      },
      (error) => {
        this.notificaciones.alerta(error);

      }
    );
    this.valida = false;
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
          handler: () => { },
        },
      ],
    });
    await actionSheet.present();
  }
  async presentAlertMultipleButtons() {
    const alert = await this.alertController.create({
      cssClass: "my-custom-class",
      header: "¿Esta seguro que desa Eliminar el registro?",
      message: "Recuerde que la acción es ireversible",
      buttons: [
        {
          text: "Cancelar",
          role: "No",
          handler: (blah) => { },
        },
        {
          text: "Confirmar",
          role: "Si",
          handler: (blah) => {
            this.eliminarRol();
          },
        },
      ],
    });
    await alert.present();
  }
  eliminarRol() {
    //this.loader = true;
    this.servicioUsuarios.eliminarRol(this.variableTO.id_rol).subscribe(
      (response) => {
        if (response.code === 200) {
          //    this.loader = false;
          this.regresar();
          //this.getRoles();
          //this.cancelarConfirmado();
          this.notificaciones.exito("se elimino correctamente");
        } else {
          //this.loader = false;
          //this.cancelarConfirmado();
          this.notificaciones.error(response.message);
        }
      },
      (error) => {
        this.notificaciones.error(error);
      }
    );
  }
  validarCheck(evento) {
  
    if (evento.detail.checked) {
      this.variableTO.activo = 1;
    } else {
      this.variableTO.activo = 0;
    }
  }
}
