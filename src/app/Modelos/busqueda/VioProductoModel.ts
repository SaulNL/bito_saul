export class VioProductoModel {
    public id_persona: number;
    public id_producto: string;
  
    constructor(id_persona: number, id_producto: string) {
      this.id_persona = id_persona;
      this.id_producto = id_producto;
    }
  }
  