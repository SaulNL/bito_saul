import { Component, OnInit } from '@angular/core';
import { NegocioModel } from "./../../../Modelos/NegocioModel";
import { Router, ActivatedRoute } from '@angular/router';
import { NegocioService } from "../../../api/negocio.service";


@Component({
  selector: 'app-card-negocio',
  templateUrl: './card-negocio.page.html',
  styleUrls: ['./card-negocio.page.scss'],
})
export class CardNegocioPage implements OnInit {
  public negocioTO: NegocioModel;
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private negocioServico: NegocioService
  ) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params && params.special) {
        this.negocioTO = JSON.parse(params.special);
      }
    });
    this.buscarNegocio();
  }

  public buscarNegocio() {
    this.negocioServico.buscarNegocio(this.negocioTO.id_negocio).subscribe(
      response => {
        this.negocioTO = response.data;
      },
      error => {
        console.log(error);
      }
    );
  }
  inforNegocio(negocio: NegocioModel) {
    this.negocioTO = JSON.parse(JSON.stringify(negocio));
    let navigationExtras = JSON.stringify(this.negocioTO);
    this.router.navigate(['/tabs/home/negocio/card-negocio/info-negocio'], {
      queryParams: { special: navigationExtras },
    });
  }

}
