import { Component, OnInit } from '@angular/core';
import { UtilsCls } from '../../utils/UtilsCls';
import { RnaService } from 'src/app/api/rna/rna.service';

@Component({
  selector: 'app-mis-sugerencias',
  templateUrl: './mis-sugerencias.page.html',
  styleUrls: ['./mis-sugerencias.page.scss'],
  providers: [UtilsCls]
})
export class MisSugerenciasPage implements OnInit {

  public sugerencias: any;
  public promoCantidad: number = 2;
  public tagsPromo: any[];
  public datoss = false;
  public bgPromo: any[];

  constructor(
    private RNA: RnaService
  ) {
    this.tagsPromo = []
    this.bgPromo = []
  }

  ngOnInit() {
    this.obtenerSugerenciasRNA();
  }

  obtenerSugerenciasRNA() {
    console.log("entre en la llamada del servicio")
    this.RNA.rnaStart(7, 10, 10, 10).then(res => {
      this.datoss = true;
      let data = JSON.stringify(res)
      let json = JSON.parse(data)
      this.sugerencias = json;
      console.log("res de la RNA", json)
      this.ajustarDatosPromo(json.promociones);
    })
  }

  ajustarDatosPromo(promo) {
    console.log(promo)
    // if (promo.abierto == "ABIERTO") {
    //   console.log("entreCambioColor")
    //   this.bgPromo = "#00ff00";
    // }
    promo.forEach(element => {
      let tags = element.tags.map(tag => tag.replace("#", "")).join(", ");
      this.tagsPromo.push(tags)
      if (element.abierto == "ABIERTO") {
        console.log("verde")
        this.bgPromo.push("#2aac09d5");
      } else {
        console.log("rojo")
        this.bgPromo.push("#e11212c7");
      }
    });
    console.log("estas son las tags", this.tagsPromo)

  }


}
