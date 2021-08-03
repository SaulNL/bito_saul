import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-formulario-negocio',
  templateUrl: './formulario-negocio.page.html',
  styleUrls: ['./formulario-negocio.page.scss'],
})
export class FormularioNegocioPage implements OnInit {
public segmentModel = 'informacion';

  constructor(private alertController: AlertController, private router: Router) { }

  ngOnInit() {
  }

    async cancelar() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: '¿Estas seguro?',
      message: 'Se cancelara todo el proceso?',
      buttons: [
        {
          text: 'Cancel',
          cssClass: 'secondary',
          handler: (blah) => {
          }
        }, {
          text: 'Confirmar',
          handler: () => {
            this.router.navigate(['/tabs/home/negocio'], { queryParams: {special: true}});
          }
        }
      ]
    });

    await alert.present();
  }

  segmentChanged(event){

  }

}
