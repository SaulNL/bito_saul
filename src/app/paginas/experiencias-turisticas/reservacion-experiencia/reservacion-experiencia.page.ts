import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ExperienciasTuristicasService} from "../../../api/experienciasTuristicas/experiencias-turisticas.service";

@Component({
  selector: 'app-reservacion-experiencia',
  templateUrl: './reservacion-experiencia.page.html',
  styleUrls: ['./reservacion-experiencia.page.scss'],
})
export class ReservacionExperienciaPage implements OnInit {

  public idExperiencia: string;
  public infoExperiencia: any;
  constructor(
      private router: Router,
      private route: ActivatedRoute,
      private experienciasService: ExperienciasTuristicasService,
  ) {
    this.infoExperiencia = [];
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.idExperiencia = params.get('id');
      this.obtenerListaExperiencia(this.idExperiencia);
    });
  }

  regresar(){
    this.router.navigate(['/tabs/experiencias-turisticas']);
  }

  obtenerListaExperiencia(id): void {
    this.experienciasService.experienciaDetalle(id).subscribe(
        res => {
          this.infoExperiencia = res.data[0];
          console.log('dtos', this.infoExperiencia);
        });
  }

}
