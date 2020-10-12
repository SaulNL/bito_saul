import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import { MsPersonaModel } from './../../Modelos/MsPersonaModel';
import { PersonaService } from '../../api/persona.service';
import { LoadingController } from '@ionic/angular';
import {ArchivoComunModel} from '../../Modelos/ArchivoComunModel';
import { UtilsCls } from './../../utils/UtilsCls';



@Component({
  selector: 'app-datos-basicos',
  templateUrl: './datos-basicos.page.html',
  styleUrls: ['./datos-basicos.page.scss'],
})
export class DatosBasicosPage implements OnInit {
  public usuarioSistema: MsPersonaModel;
  public loader: any;

  constructor(
    private servicioPersona: PersonaService,
    public loadingController: LoadingController,
    private utilsCls: UtilsCls
  ) { }

  ngOnInit() {
    this.usuarioSistema = new MsPersonaModel();
    this.actualizarUsuario();
  }
  async presentLoading() {
    this.loader = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'por favor espera...'
    });
   return this.loader.present();
  }
  private actualizarUsuario() {
    this.usuarioSistema = JSON.parse(localStorage.getItem('u_data'));
    this.usuarioSistema.fecha_nacimiento = this.usuarioSistema.fecha_nacimiento !== null ? new Date(this.usuarioSistema.fecha_nacimiento) : null;
  }
  actualizarDatos(formBasicos: NgForm) {
    this.presentLoading();
    const miPrimeraPromise = new Promise((resolve, reject) => {
      this.servicioPersona.guardar(this.usuarioSistema).subscribe(
        data => {
          if(data.code === 200){
            this.loader.dismiss();
            //this.notificacionService.pushAlert(data.message); 
          }
          //const resultado = this.sesionUtl.actualizarSesion();
          //this.router.navigate(['/home/mi/cuenta/inicio']);
          this.loader.dismiss();
          //this.notificacionService.pushInfo(data.data.mensaje);
         // resolve(resultado);

        },
        error => {
          this.loader.dismiss();
          //  this.notificacionService.pushError(error);
          // this.lstPrincipal = new Array();

        });
    });
    miPrimeraPromise.then((successMessage) => {
    });
  }
  public subir_imagen_cuadrada(event) {
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
          if (width === 400 && height === 400) {
            const file_name = archivo.name;
            const file = archivo;
            if (file.size < 3145728) {
              let file_64: any;
              const utl = new UtilsCls();
              utl.getBase64(file).then(
                data => {
                  const archivo = new ArchivoComunModel();
                  if (file_name != null) {
                    archivo.nombre_archivo = this.utilsCls.convertir_nombre(file_name);
                    archivo.archivo_64 = file_64;
                  }
                  this.usuarioSistema.selfie = archivo;
                }
              );
            } else {
            //  this.notificacionService.pushAlert('comun.file_sobrepeso');
            }
          }else {
            console.log('es mayor');
          }
        }
      }
    }
  }
 }
}
