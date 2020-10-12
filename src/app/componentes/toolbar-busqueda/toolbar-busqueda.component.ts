import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-toolbar-busqueda',
  templateUrl: './toolbar-busqueda.component.html',
  styleUrls: ['./toolbar-busqueda.component.scss'],
})
export class ToolbarBusquedaComponent implements OnInit {
  @Input() public placeHolder: string = 'Buscar'
  @Output() public buscarEmit = new EventEmitter()
  strBuscar: String;

  constructor() { }

  ngOnInit() {}

  buscar() {
    console.log(this.strBuscar)
    this.buscarEmit.emit(this.strBuscar);
  }

  limpiar() {
    this.strBuscar = null;
    this.buscar();
  }
}
