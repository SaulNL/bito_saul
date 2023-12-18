import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mis-experiencias-turisticas',
  templateUrl: './mis-experiencias-turisticas.page.html',
  styleUrls: ['./mis-experiencias-turisticas.page.scss'],
})
export class MisExperienciasTuristicasPage implements OnInit {

  public loader: boolean = false;
  public msj = 'Cargando';

  constructor(
    private _router: Router,
  ) { }

  ngOnInit() {
  }

  agregarExperiencia() {
    this._router.navigate(["/tabs/mis-experiencias-turisticas/fermulario-experiencias"])
  }

}
