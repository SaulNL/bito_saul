import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-imagenes-slide",
  templateUrl: "./imagenes-slide.component.html",
  styleUrls: ["./imagenes-slide.component.scss"],
})
export class ImagenesSlideComponent implements OnInit {
  @Input() public imagen: any;
  public lstImagene: any;
  public lstImagen: any;
  public multiImagen: any;
  constructor() {
    this.multiImagen = true;
  }

  slidesOptions = {
    slidesPerView: 1.5,
    centeredSlides: true,
    loop: false,
    spaceBetween: 10,
  };

  ngOnInit() {
    this.slidesOptions;
    this.multiImagen = true;
    if (!Array.isArray(this.imagen.imagen)) {

      this.multiImagen = false;
      this.lstImagen = this.imagen.imagen;
    } else {
      if (this.imagen.imagen.length > 1) {

        this.multiImagen = true;
        this.lstImagene = this.imagen.imagen;
      } else {
        
        this.multiImagen = false;
        this.lstImagen = this.imagen.imagen[0];
      }
    }
  }
}
