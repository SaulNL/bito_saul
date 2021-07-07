import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
  selector: "app-infinito-scroll",
  templateUrl: "./infinito-scroll.component.html",
  styleUrls: ["./infinito-scroll.component.scss"],
})
export class InfinitoScrollComponent implements OnInit {
  @Output() public respuesta = new EventEmitter<any>();
  @Input() public activado: any;
  @Input() public msj: any;
  constructor() {}

  ngOnInit() {}

  cargarMas(evento: any) {
    this.respuesta.emit(evento);
  }
}
