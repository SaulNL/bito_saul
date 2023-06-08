import { Component, OnInit } from '@angular/core';
import { UtilsCls } from '../../utils/UtilsCls';
import { RnaService } from '../../api/rna/rna.service';
import { ModalController } from '@ionic/angular';
import { PromocionInfoComponent } from './promocion-info/promocion-info.component';
import { ProductoModel } from "../../Modelos/ProductoModel";
import { ProductInterface } from "../../Bitoo/models/product-model";
import { CreateObjects } from "./../../Bitoo/helper/create-object";
import { ModalDetalleProductoComponent } from "src/app/components/modal-detalle-producto/modal-detalle-producto.component";
import { Router } from '@angular/router';
import { ToadNotificacionService } from 'src/app/api/toad-notificacion.service';

@Component({
  selector: 'app-mis-sugerencias',
  templateUrl: './mis-sugerencias.page.html',
  styleUrls: ['./mis-sugerencias.page.scss'],
  providers: [UtilsCls, CreateObjects]
})
export class MisSugerenciasPage implements OnInit {

  public sugerencias: any;
  public cantidadPromo: number;
  public cantidadProduct: number;
  public cantidadNego: number;
  public promoCantidad: number = 4;
  public productCantidad: number = 4;
  public negoCantidad: number = 4;
  public tagsPromo: any[];
  public datoss = false;
  public bgPromo: any[];
  public masPromo: boolean = true;
  public masProductos: boolean = true;
  public masNegocios: boolean = true;
  public masMenos: boolean = true
  public loader: boolean;
  public uData: any;
  public listaDias: any[];

  constructor(
    private RNA: RnaService,
    public modalController: ModalController,
    private createObject: CreateObjects,
    private ruta: Router,
    private notificaciones: ToadNotificacionService,
  ) {
    this.tagsPromo = []
    this.bgPromo = []
  }

  ngOnInit() {
    this.uData = JSON.parse(localStorage.getItem('u_data'));
    this.obtenerSugerenciasRNA();
  }

  obtenerSugerenciasRNA() {
    console.log("entre en la llamada del servicio")
    this.RNA.rnaStart(7, 10, 10, 10).then(res => {
      this.datoss = true;
      let data = JSON.stringify(res)
      let json = JSON.parse(data)
      this.sugerencias = json;
      this.cantidadPromo = json.promociones.length;
      this.cantidadProduct = json.productos.length;
      this.cantidadNego = json.negocios.length;
      console.log("res de la RNA", json)
      this.ajustarDatosPromo(json.promociones);
    })
  }

  getFirstImage(image) {
    let img;

    if (Array.isArray(image)) {
      img = image.length === 0 ? "https://ecoevents.blob.core.windows.net/comprandoando/tinBitoo/Web/PROVEEDOR/LA%20IMAGEN%20NO%20ESTA%20DISPONIBLE%20700%20X%20700.png" : image[0];
      return img;
    } else {
      img = image === '' ? "https://ecoevents.blob.core.windows.net/comprandoando/tinBitoo/Web/PROVEEDOR/LA%20IMAGEN%20NO%20ESTA%20DISPONIBLE%20700%20X%20700.png" : image;
      return img;
    }
  }

  ajustarDatosPromo(promo) {
    console.log(promo)
    promo.forEach((element) => {
      let tags = element.tags.map(tag => tag.replace("#", "")).join(", ");
      this.tagsPromo.push(tags)
    });
    console.log("estas son las tags", this.tagsPromo)
  }

  verMas(tipo) {
    if (tipo === 1) {
      this.masProductos = this.masMenos ? false : true;
      this.masNegocios = this.masMenos ? false : true;
      this.promoCantidad = this.masMenos ? 10 : 4;
      this.masMenos = this.masMenos ? false : true;
    }
    if (tipo === 2) {
      this.masPromo = this.masMenos ? false : true;
      this.masNegocios = this.masMenos ? false : true;
      this.productCantidad = this.masMenos ? 10 : 4;
      this.masMenos = this.masMenos ? false : true;
    }
    if (tipo === 3) {
      this.masProductos = this.masMenos ? false : true;
      this.masPromo = this.masMenos ? false : true;
      this.negoCantidad = this.masMenos ? 10 : 4;
      this.masMenos = this.masMenos ? false : true;
    }
  }

  async crearModalPromocion(promocion) {

    this.listaDias = []
    let dias = {
      dias: [],
      hora_fin: "",
      hora_inicio: "",
      id_horario: 1
    }
    promocion.dias.forEach(element => {
      let diasA = element.dias.split(",").map((dia) => dia.trim()).filter((dia) => dia !== '');
      if (diasA.length > 1) {
        diasA.splice(diasA.length - 1, 0, "y");
      }
      dias.dias = diasA
      dias.hora_fin = element.hora_fin
      dias.hora_inicio = element.hora_inicio
      dias.id_horario = element.id_horario_promocion
      this.listaDias.push(dias)
    });

    const modal = await this.modalController.create({
      component: PromocionInfoComponent,
      componentProps: {
        'promocion': promocion,
        'idPersona': this.uData.id_persona,
        'listaDias': this.listaDias
      }
    });
    modal.onDidDismiss()
      .then((data) => {
        const user = data['data'];
        this.loader = true;
      });
    return await modal.present();
  }

  async CrearModalProducto(producto: ProductoModel) {
    this.loader = true
    var product: ProductInterface = this.createObject.createProduct(producto);
    //console.log("palabraBuqueda MOdal: "+this.palabraBuqueda)
    const modal = await this.modalController.create({
      component: ModalDetalleProductoComponent,
      cssClass: 'my-custom-class',
      componentProps: {
        productObject: product,
        producto: producto.idProducto,
        palabraBuqueda: undefined
      }
    });
    await modal.present();
    await modal.onDidDismiss().then(r => {
      if (r == undefined) {
        this.loader = false
      } else {
        this.loader = false
      }
    }
    );
  }

  abrirNego(negocioURL) {
    if (negocioURL == "") {
      this.notificaciones.error(
        "Este negocio aún no cumple los requisitos mínimos"
      );
    } else {
      this.ruta.navigate(["/tabs/negocio/" + negocioURL], {
        queryParams: { route: true },
      });
    }
    // this.ruta.navigate(["/tabs/negocio/" + negocioURL]);
  }


}
