import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-fermulario-experiencias',
  templateUrl: './fermulario-experiencias.page.html',
  styleUrls: ['./fermulario-experiencias.page.scss'],
})
export class FermularioExperienciasPage implements OnInit {

  public loader: boolean = false;
  public msj = 'Cargando';
  experienciasForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder
  ) {
    this.experienciasForm = this.formBuilder.group({
      titulo_experiencia: ['', Validators.required],
      id_experiencia_turistica: [''],
      id_negocio: [''],
      descripcion_experiencia: [''],
      id_estado: [''],
      id_municipio: [''],
      id_localidad: [''],
      calle: [''],
      numero_ext: [''],
      numero_int: [''],
      colonia: [''],
      codigo_postal: [''],
      latitud: [''],
      longitud: [''],
      fecha_inicio_experiencia: [''],
      fecha_fin_experiencia: [''],
      hora_inicio_experiencia: [''],
      hora_fin_experiencia: [''],
      telefono_experiencia: [''],
      tags_experiencia: [''],
      tipo_experiencia: [''],
      tipo_pago_transferencia: [''],
      tipo_pago_tarjeta_debito: [''],
      tipo_pago_tarjeta_credito: [''],
      tipo_pago_efectivo: [''],
      id_tipo_recurrencia_experiencia: [''],
      requiere_confirmacion: [''],
      activo: [''],
      eliminado: [''],
      fotografias: [''],
      videos: [''],
    });
   }

  ngOnInit() {
  }

}
