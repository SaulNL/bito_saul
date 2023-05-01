import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: "app-recargar",
  templateUrl: "./recargar.component.html",
  styleUrls: ["./recargar.component.scss"],
})
export class RecargarComponent implements OnInit {
  @Output() respuesta = new EventEmitter<any>();

  constructor() {}

  ngOnInit() {}

  public recargar(event: any) {
    this.respuesta.emit({ active: false });
    setTimeout(() => {
      event.target.complete();
      this.respuesta.emit({ active: true });
    }, 2000);
  }
}
