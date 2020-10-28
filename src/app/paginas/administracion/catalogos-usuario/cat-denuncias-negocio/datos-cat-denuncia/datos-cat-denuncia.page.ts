import { Component, OnInit, Input } from '@angular/core';
import { DenunciaModel } from '../../../../../Modelos/DenunciaModel';
import {Router, ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-datos-cat-denuncia',
  templateUrl: './datos-cat-denuncia.page.html',
  styleUrls: ['./datos-cat-denuncia.page.scss'],
})
export class DatosCatDenunciaPage implements OnInit {
  public actualTO: DenunciaModel;
  public variableTO: DenunciaModel;
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { 
    this.variableTO = new DenunciaModel();
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params && params.special) {
        this.actualTO = JSON.parse(params.special);
        this.variableTO = this.actualTO;
      }
    });
    
    
  }
  regresar() {
    this.router.navigate(['/tabs/home/cat-denuncias-negocio'], { queryParams: {special: true}  });
  }
}
