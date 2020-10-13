import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-banner-promciones',
  templateUrl: './banner-promciones.component.html',
  styleUrls: ['./banner-promciones.component.scss'],
})
export class BannerPromcionesComponent implements OnInit {
@Input() public listaPromociones: [];
@Input() public listaAvisos: [];
listaPromo: any;
listaAviso: any;
  constructor() { 

  }

  ngOnInit() {
   console.log(this.listaPromociones);
   console.log(this.listaAvisos);
  }

}
