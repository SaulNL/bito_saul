import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { element } from 'protractor';

@Component({
  selector: 'app-input-tags',
  templateUrl: './input-tags.component.html',
  styleUrls: ['./input-tags.component.scss'],
})
export class InputTagsComponent implements OnInit {

  public tagActual: any[] = [];
  public nuevaTag: string;
  public placeHolder: string;
  @Input() public tags;
  @Input() public tipo: boolean;
  @Output() _enviarTags: EventEmitter<any>;

  constructor() {
    this._enviarTags = new EventEmitter();
  }

  ngOnInit() {
    this.asignarValoresTAgs()
    console.log("tipo", this.tipo);
    this.placeHolder = this.tipo == false ? "Enter o (,) para guardar la tag" : "(,) para guardar la tag";
  }

  agregartag(event) {
    const value = event.target.value.trim();
    console.log(value)
    if (value.endsWith(',') || event.key === 'Enter') {
      let conComa = (event.target as HTMLInputElement).value;
      console.log(conComa)
      if (conComa != "") {
        this.nuevaTag = conComa.replace(/,/g, "")
        if (this.tagActual[0] == '') {
          this.tagActual.splice(0)
        }
        this.tagActual.push(this.nuevaTag);
        this._enviarTags.emit(this.tagActual);
      }
      (event.target as HTMLInputElement).value = '';
    }
  }

  asignarValoresTAgs() {
    if (this.tags[0] == '' || typeof this.tags == "object" && this.tags.length == 0) {
      this.tags = '';
    }
    if (typeof this.tags == "object" && this.tags[0] != '') {
      let stringTag = '';
      this.tags.forEach((element, index) => {

        if (index === this.tags.length - 1) {
          stringTag += element
        } else {
          stringTag += `${element}, `
        }
        console.log(stringTag)
      })
      this.tags = stringTag;
    }
    console.log(typeof this.tags, this.tags)
    this.tagActual = this.tags.split(", ")
  }
  eliminarTag(index) {
    this.tagActual.splice(index, 1)
    this._enviarTags.emit(this.tagActual)

  }
}