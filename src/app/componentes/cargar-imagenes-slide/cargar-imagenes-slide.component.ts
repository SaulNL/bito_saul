import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
  selector: "app-cargar-imagenes-slide",
  templateUrl: "./cargar-imagenes-slide.component.html",
  styleUrls: ["./cargar-imagenes-slide.component.scss"],
})
export class CargarImagenesSlideComponent implements OnInit {
  @Input() public productoImagen: any;
  @Output() public subidaProducto = new EventEmitter<any>();
  @Output() public borrarImagen = new EventEmitter<any>();

  constructor() {}

  slidesOptions = {
    slidesPerView: 1.5,
    centeredSlides: true,
    loop: false,
    spaceBetween: 10,
  };

  ngOnInit() {

  }

  public subirImagenUno(event: any) {

    this.subidaProducto.emit(this.build(0, event));
  }
  public subirImagenDos(event: any) {

    this.subidaProducto.emit(this.build(1, event));
  }
  public subirImagenTres(event: any) {

    this.subidaProducto.emit(this.build(2, event));
  }
  public subirImagenCuatro(event: any) {


    this.subidaProducto.emit(this.build(3, event));
  }
  private build(position: any, img: any) {
    const imagen = { event: img, posicion: position };

    
    return imagen;
  }

  public setImagen(imagen: any) {
    if(imagen.archivo_64 === undefined){
      return imagen;
    }
    return imagen.archivo_64;
  }
  public remove(position: any){
    const borrado = {
      po : position
    };
    this.borrarImagen.emit(borrado);
  }
  public removeOno(){
    this.remove(0);
  }
  public removeDos(){
    this.remove(1);
  }
  public removeTres(){
    this.remove(2);
  }
  public removeCuatro(){
    this.remove(3);
  }
}
