import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import { MsPersonaModel } from './../../Modelos/MsPersonaModel';


@Component({
  selector: 'app-datos-basicos',
  templateUrl: './datos-basicos.page.html',
  styleUrls: ['./datos-basicos.page.scss'],
})
export class DatosBasicosPage implements OnInit {
  public usuarioSistema: MsPersonaModel;

  constructor() { }

  ngOnInit() {
    this.usuarioSistema = new MsPersonaModel();
  }
  actualizarDatos(formBasicos: NgForm) {
    console.log(formBasicos);
  }
}
