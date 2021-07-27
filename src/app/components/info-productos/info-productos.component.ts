import { Component, Input, OnInit } from "@angular/core";
import { ProductoModel } from "../../Modelos/ProductoModel";
import { ModalController } from "@ionic/angular";
import { NegocioService } from "../../api/negocio.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-info-productos",
  templateUrl: "./info-productos.component.html",
  styleUrls: ["./info-productos.component.scss"],
})
export class InfoProductosComponent implements OnInit {

  @Input() public producto: any;
  constructor(
    public modalCtrl: ModalController,
    private negocioServico: NegocioService,
    private router: Router
  ) {}

  ngOnInit() {}

  verMas(producto: ProductoModel) {
    console.log(producto.negocio.idNegocio);
    this.negocioServico.buscarNegocio(producto.negocio.idNegocio).subscribe(
      (response) => {
        this.router.navigate(["/tabs/negocio/" + response.data.url_negocio]);
        this.modalCtrl.dismiss();
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
