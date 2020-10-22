import { Component, OnInit, ViewChild } from '@angular/core';
import {FormControl, FormGroup, NgForm} from '@angular/forms';
import {GeneralServicesService} from "../../../api/general-services.service";

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.page.html',
  styleUrls: ['./contacto.page.scss'],
})
export class ContactoPage implements OnInit {
  @ViewChild('formContacto') formContactoView: NgForm;
  public contactanos: FormGroup;
  public btnLoader = false;
  public contacto={
    nombre: '',
    telefono: '',
    correo: '',
    comentario: ''
  }
  constructor(
    private _general_service: GeneralServicesService
    //private servicioNotificaciones: NotificacionService
  ) { }

  ngOnInit() {
    //this.formularioContactanos();
  }

  /**
   * Funcion para cargar el formulario
   * @author Omar
   */
  formularioContactanos(){
    this.contactanos = new FormGroup({
      nombre: new FormControl(''),
      telefono: new FormControl(''),
      correo: new FormControl(''),
      comentario: new FormControl(''),
    });
  }

  /**
   * Funcion para enviar comentario
   * @author Omar
   */
  enviarCorreo(){
      this.btnLoader = true;
      this._general_service.enviarComentarioCorreo(this.contacto).subscribe(
        response => {
          if (response.code === 200) {
            //this.contactanos.reset();
            //this.formContactoView.resetForm();
            this.contacto.nombre='';
            this.contacto.telefono='';
            this.contacto.correo='';
            this.contacto.comentario='';
          }
          //this.servicioNotificaciones.pushMsjRespuesta(response.message, response.code);
          console.log(`${response.message}\n${response.code}`);
          
        },
        error => {
          //this.servicioNotificaciones.pushMsjRespuesta(error.message, error.code);
          console.log(error);          
        },
        () => {
        this.btnLoader = false;
      });
  }

}
