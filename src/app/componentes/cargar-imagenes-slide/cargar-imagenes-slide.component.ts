import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
  selector: "app-cargar-imagenes-slide",
  templateUrl: "./cargar-imagenes-slide.component.html",
  styleUrls: ["./cargar-imagenes-slide.component.scss"],
})
export class CargarImagenesSlideComponent implements OnInit {
  @Input() public productoImagen: any;
  @Output() public subidaProducto = new EventEmitter<any>();

  constructor() {}

  slidesOptions = {
    slidesPerView: 1.5,
    centeredSlides: true,
    loop: true,
    spaceBetween: 10,
  };

  ngOnInit() {
    console.log(this.productoImagen.imagen);
    console.log(this.productoImagen.imagen[0]);
    console.log(this.productoImagen.imagen[1]);
    console.log(this.productoImagen.imagen[2]);
    console.log(this.productoImagen.imagen[3]);
  }

  public subirImagenUno(event: any) {
    console.log(event);
    console.log("evento uno");
    this.subidaProducto.emit(this.build(0, event));
  }
  public subirImagenDos(event: any) {
    console.log(event);
    console.log("evento dos");
    this.subidaProducto.emit(this.build(1, event));
  }
  public subirImagenTres(event: any) {
    console.log(event);
    console.log("evento tres");
    this.subidaProducto.emit(this.build(2, event));
  }
  public subirImagenCuatro(event: any) {

    console.log(event);
    console.log("evento cuatro");
    this.subidaProducto.emit(this.build(3, event));
  }
  private build(position: any, img: any) {
    const imagen = { event: img, posicion: position };

    console.log(imagen);
    return imagen;
  }

  public setImagen(imagen: any) {
    if(imagen.archivo_64 === undefined){
      return imagen;
    }
    return imagen.archivo_64;
  }
}
