import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ToadNotificacionService } from 'src/app/api/toad-notificacion.service';

@Component({
  selector: 'app-input-tags',
  templateUrl: './input-tags.component.html',
  styleUrls: ['./input-tags.component.scss'],
})
export class InputTagsComponent implements OnInit {
  @Input() public tags;
  @Input() public tipo: boolean;
  @Output() _enviarTags: EventEmitter<any>;

  public tagActual: any[] = [];
  public nuevaTag: string;
  public placeHolder: string;
  public limiteTags: boolean;
  

  constructor(
    private notificaciones: ToadNotificacionService,
  ) {
    this._enviarTags = new EventEmitter();
  }

  ngOnInit() {
    this.asignarValoresTAgs()
    this.placeHolder = this.tipo == false ? "Enter o (,) para guardar la tag" : "(,) para guardar la tag";
  }

  agregartag(event) {
    const value = event.target.value.trim();
    if (value.endsWith(',') || event.key === 'Enter') {
      let conComa = (event.target as HTMLInputElement).value;
      if (conComa != "") {
        this.nuevaTag = conComa.replace(/,/g, "")
        if (this.tagActual[0] == '') {
          this.tagActual.splice(0)
        }
        let existTAg = this.tagActual.find(element => element == this.nuevaTag) ? true :false;
        if(this.tagActual.length < 5){
          this.tagActual.push(this.nuevaTag);
          this.limiteTags = false;
        } else {
          this.limiteTags = true;
        }
        this._enviarTags.emit(this.tagActual);
      }
      this.nuevaTag =""
    }
  }

  asignarValoresTAgs() {
    console.log("queTiene:", this.tags)
    if (!this.tags || typeof this.tags == "object" && this.tags.length == 0) {
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
      })
      this.tags = stringTag;
    }
    this.tagActual = this.tags.split(", ")
    if(this.tagActual.length >5){
      this.notificaciones.toastInfo(`Haz alcanzo el límite de etiquetas.`)
    }
    console.log("tagsActuales",this.tagActual)
  }

  eliminarTag(index) {
    this.tagActual.splice(index, 1)
    this._enviarTags.emit(this.tagActual)

  }
}