import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-input-tags',
  templateUrl: './input-tags.component.html',
  styleUrls: ['./input-tags.component.scss'],
})
export class InputTagsComponent implements OnInit {

  public tagActual: any[] = [];
  public nuevaTag: string;
  @Input() public tags;
  @Output() _enviarTags: EventEmitter<any>;

  constructor() {
    this._enviarTags = new EventEmitter();
  }

  ngOnInit() {
    this.asignarValoresTAgs()
  }

  agregartag(event) {
    if (event.key === 'Enter') {
      this.nuevaTag = (event.target as HTMLInputElement).value;
      if (this.tagActual[0] == '') {
        this.tagActual.splice(0)
      }
      this.tagActual.push(this.nuevaTag);
      this._enviarTags.emit(this.tagActual);
      (event.target as HTMLInputElement).value = '';
    }
  }

  asignarValoresTAgs() {
    this.tagActual = this.tags.split(", ")
  }
  eliminarTag(index) {
    this.tagActual.splice(index, 1)
    this._enviarTags.emit(this.tagActual)

  }
}