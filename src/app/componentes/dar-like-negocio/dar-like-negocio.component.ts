import { UtilsCls } from "./../../utils/UtilsCls";
import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-dar-like-negocio",
  templateUrl: "./dar-like-negocio.component.html",
  styleUrls: ["./dar-like-negocio.component.scss"],
})
export class DarLikeNegocioComponent implements OnInit {
  @Input() public negocio: any;
  public usuario: any;
  public mostrarLike: any;
  constructor(private util: UtilsCls) {
    this.usuario = this.util.getUserData();
    this.mostrarLike = this.util.existSession();
  }

  ngOnInit() {}
}
