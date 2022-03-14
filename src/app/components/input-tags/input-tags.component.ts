import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-input-tags',
  templateUrl: './input-tags.component.html',
  styleUrls: ['./input-tags.component.scss'],
})
export class InputTagsComponent implements OnInit {

  public tagContainer;
  public input;
  @Input() public tags;
  @Output() _enviarTags: EventEmitter < any > ;

  constructor() {
    this._enviarTags = new EventEmitter();
  }

  ngOnInit() {
    this.tagContainer = document.querySelector('.tag-container');
    this.input = document.querySelector('.input');
    this.input.addEventListener('ionInput', (e) => {
      if (e.detail.data === ',') {
        if (this.input.value.length !== 0) {
          let numero = this.input.value.indexOf(",");
          let tag = this.input.value.slice(0, numero);
          this.tags.push(tag);
          this.agregarTags();
          this._enviarTags.emit(this.tags);
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
        const index = this.tags.indexOf(value);
        this.tags = [...this.tags.slice(0, index), ...this.tags.slice(index + 1)];
        this.agregarTags();
        this._enviarTags.emit(this.tags);
      }
    });

    if (this.tags.length !== 0) {
      this.agregarTags();
      this._enviarTags.emit(this.tags);
    }
  }

  crearTag(label) {
    const div = document.createElement('div');
    div.setAttribute('class', 'tag');
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

  agregarTags() {
    if(this.tags[0]==="" && this.tags.length===1){
      this.tags = [];
    }else{
      const borrar = document.querySelectorAll('.tag');
      borrar.forEach(tag => {
        tag.parentElement.removeChild(tag);
      });
      this.tags.slice().reverse().forEach(etiqueta => {
        const tag = this.crearTag(etiqueta);
        this.tagContainer.prepend(tag);
      });
    }
  }
}