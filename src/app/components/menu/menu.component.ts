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
  public isAlert: boolean = false;

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
    this.isAlert = true;
  }

  cerrarAlert(isAlert: boolean){
    this.isAlert = isAlert;
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
      title: "Queremos conocer más sobre tus gustos en Bituyú.",
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
