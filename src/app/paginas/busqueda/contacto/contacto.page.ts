import { Component, OnInit, ViewChild } from '@angular/core';
import {FormControl, FormGroup, NgForm, Validators, FormBuilder } from '@angular/forms';
import {GeneralServicesService} from "../../../api/general-services.service";
import {ToadNotificacionService} from '../../../api/toad-notificacion.service';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.page.html',
  styleUrls: ['./contacto.page.scss'],
})
export class ContactoPage implements OnInit {
  @ViewChild('formContacto') formContactoView: NgForm;
  public formBuilders = new FormBuilder();
  public contactanos: any;
  public btnLoader = false;

  constructor(
    private _general_service: GeneralServicesService,
    private notificaciones: ToadNotificacionService
  ) { }

  ngOnInit() {
    this.formularioContactanos();
  }

  /**
   * Funcion para cargar el formulario
   * @author Yair
   */
  formularioContactanos(){
    this.contactanos = this.formBuilders.group({
      nombre: ['',Validators.required],
      telefono: ['',Validators.required],
      correo: ['',[Validators.required, Validators.email]],
      comentario: ['',[Validators.required,Validators.minLength(5)]],
    });
  }

  /**
   * Funcion para enviar comentario
   * @author Yair
   */
  enviarCorreo(){
    this.btnLoader = true;
    let formData = this.contactanos.value;
      this._general_service.enviarComentarioCorreo(JSON.stringify(formData)).subscribe(
        response => {
          if (response.code === 200) {
            this.contactanos.reset();
          }
          this.notificaciones.exito(response.message);          
        },
        error => {
          this.notificaciones.error(error);       
        },
        () => {
        this.btnLoader = false;
      });
  }

}
