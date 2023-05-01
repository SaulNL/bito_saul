import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-input-lugares-entrega',
  templateUrl: './input-lugares-entrega.component.html',
  styleUrls: ['./input-lugares-entrega.component.scss'],
})
export class InputLugaresEntregaComponent implements OnInit {

  public lugarContainer;
  public input;
  @Input() public lugaresEntrega;
  @Output() _enviarLugaresEntrega: EventEmitter<any>;

  constructor() {
    this._enviarLugaresEntrega = new EventEmitter();
  }

  ngOnInit() {
    this.lugarContainer = document.querySelector('.lugar-container');
    this.input = document.querySelector('.input-lugar');
    this.input.addEventListener('ionInput', (e) => {
      if (e.detail.data === ',') {
        if (this.input.value.length !== 0) {
          let numero = this.input.value.indexOf(",");
          let lugar = this.input.value.slice(0, numero);
          this.lugaresEntrega.push(lugar);
          this.agregarLugares();
          this._enviarLugaresEntrega.emit(this.lugaresEntrega);
          this.input.value = '';
        }
      }
    }, false);

    this.input.addEventListener('ionInput', (e) => {
      if (e.detail.data === ',') {
        this.input.value = '';
      }
    }, false);

    document.addEventListener('click', (e: MouseEvent) => {
      const element = e.target as HTMLElement;
      if (element.tagName === 'I') {
        const value = element.getAttribute('data-item');
        const index = this.lugaresEntrega.indexOf(value);
        this.lugaresEntrega = [...this.lugaresEntrega.slice(0, index), ...this.lugaresEntrega.slice(index + 1)];
        this.agregarLugares();
        this._enviarLugaresEntrega.emit(this.lugaresEntrega);
      }
    });

    if (this.lugaresEntrega.length !== 0) {
      this.agregarLugares();
      this._enviarLugaresEntrega.emit(this.lugaresEntrega);
    }
  }


  crearLugar(label) {
    const div = document.createElement('div');
    div.setAttribute('class', 'lugar');
    const span = document.createElement('span');
    div.style.padding = '5px';
    div.style.border = '1px solid #ccc';
    div.style.margin = '5px';
    div.style.display = 'flex';
    div.style.alignItems = 'center';
    div.style.borderRadius = '15px';
    div.style.background = '#c9c9c9';
    div.style.fontSize = '16px';
    span.innerHTML = label;
    const closeBn = document.createElement('i');
    closeBn.style.fontSize = "16px";
    closeBn.style.marginLeft = "5px";
    closeBn.style.color = "#606060";
    closeBn.setAttribute('class', 'material-icons');
    closeBn.setAttribute('data-item', label);
    closeBn.innerHTML = 'cancel';
    div.appendChild(span);
    div.appendChild(closeBn);
    return div;
  }

  agregarLugares() {
    const borrar = document.querySelectorAll('.lugar');
    borrar.forEach(lugar => {
      lugar.parentElement.removeChild(lugar);
    });
    this.lugaresEntrega.slice().reverse().forEach(etiqueta => {
      const lugar = this.crearLugar(etiqueta);
      this.lugarContainer.prepend(lugar);
    });
  }

}
