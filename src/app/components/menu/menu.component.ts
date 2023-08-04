import { UtilsCls } from 'src/app/utils/UtilsCls';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { FiltrosService } from 'src/app/api/filtros.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  public user: any;
  public nombreUsuario: string;
  public logeado: any;
  public preferencias: boolean;

  constructor(
    private router: Router,
    private util: UtilsCls,
    public alertController: AlertController,
    private filtrosService: FiltrosService,
  ) {
    this.user = this.util.getUserData();
    this.logeado = Object.keys(this.user).length === 0 ? false : true;

    this.nombreUsuario = `${this.user.nombre}`
  }
  ionViewWillEnter() {
  }

  ngOnInit() {
    this.obtenerPreferencias(this.user.id_persona);
  }

  openCat() {
    localStorage.removeItem('byCategorias');
    localStorage.setItem('isRedirected', 'false');
    this.router.navigate(['/tabs/categorias']);
  }
  openSug() {
    if (this.logeado) {
      if (this.preferencias) {
        this.router.navigate(['/tabs/mis-sugerencias']);
      } else {
        this.alertaPreferencias()
      }
    } else {
      this.mensajeRegistro();
    }
  }

  abrirConocenos(){
    this.router.navigate(['/tabs/home/conocenos']);
  }

  async mensajeRegistro() {
    const alert = await this.alertController.create({
      header: 'Bituyú!',
      message: "¿Ya tienes una cuenta?",
      buttons: [
        {
          text: "Iniciar sesión",
          cssClass: 'text-grey',
          handler: () => {
            this.router.navigate(['/tabs/login']);
          }
        },
        {
          text: "Registrate",
          cssClass: 'text-rosa',
          handler: () => {
            this.router.navigate(["/tabs/login/sign-up"]);
          },
        },
      ],
    });
    await alert.present();
  }

  async obtenerPreferencias(id_persona: number) {
    this.filtrosService.obtenerPreferencias(id_persona).subscribe(
      async response => {
        if (response.code == 200) {
          this.preferencias = await response.data.preferencias.length < 1 ? false : true;
        }
      },
      error => {
      }
    );

  }

  alertaPreferencias() {
    const Toast = Swal.mixin({
      toast: true,
      position: 'center'
    })
    Toast.fire({
      title: "Queremos conocer más sobre tus gustos en Bitoo.",
      text: "Registra tus preferencias",
      icon: 'info',
      showDenyButton: false,
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: '¡Claro!',
      cancelButtonText: 'Después',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(["/tabs/home/preferencias"]);
      } else if (result.isDismissed || result.isDenied) {
      }
    })
  }

}
