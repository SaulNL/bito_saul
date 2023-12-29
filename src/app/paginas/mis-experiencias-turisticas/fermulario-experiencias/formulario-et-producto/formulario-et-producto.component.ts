import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FilePicker } from '@capawesome/capacitor-file-picker';
import { ModalController, NavParams } from '@ionic/angular';
import { ArchivoComunModel } from 'src/app/Modelos/ArchivoComunModel';
import { PersonaService } from 'src/app/api/persona.service';
import { ToadNotificacionService } from 'src/app/api/toad-notificacion.service';
import { RecorteImagenComponent } from 'src/app/components/recorte-imagen/recorte-imagen.component';
import { UtilsCls } from 'src/app/utils/UtilsCls';

@Component({
  selector: 'app-formulario-et-producto',
  templateUrl: './formulario-et-producto.component.html',
  styleUrls: ['./formulario-et-producto.component.scss'],
})
export class FormularioEtProductoComponent implements OnInit {

  public loader: boolean = false;
  public msj = 'Cargando';
  public fotografiasArray: any;
  public fotosArrayAgregar: any;
  public galeriaFull = false;
  public productoDatos: any
  public numeroFotos: number;
  public numeroFotosEdit: number;
  public numeroFotosPermitidas: number;
  public resizeToWidth = 0;
  public resizeToHeight = 0;
  public bandera: boolean;
  public mensaje: string;
  public lstOrg: any;
  public subioimg: boolean = false;

  productoForm: FormGroup;
  slideOpts = {
    slidesPerView: 1.5,
    centeredSlides: true,
    loop: false,
    spaceBetween: 10,
  };
  

  constructor(
    private modalCtrl: ModalController,
    private formBuilder: FormBuilder,
    private _utils_cls: UtilsCls,
    private notificaciones: ToadNotificacionService,
    private navParams: NavParams,
    private personaService: PersonaService,
  ) { 
    this.productoForm = this.formBuilder.group({
      concepto: ['', [Validators.required]],
      precio: ['', [Validators.required]],
      existencia: ['', [Validators.required]],
      cantidad_disponibles: [''],
      descripcion_concepto: ['', [Validators.required]],
      fotografia: [''],
      porcentaje_descuento: ['', [Validators.required]],
      id_organizacion: [''],
      activo: false,
    });
    this.fotografiasArray = [];
    this.fotosArrayAgregar = [];
    this.bandera = true;
    this.productoDatos = this.navParams.get('productoDatos');
    console.log('datosProductos',this.productoDatos)
  }

  ngOnInit() {
    if (this.productoDatos.data) {
      this.asignarValores();
    }
    this.obtenerAfiliaciones();
  }

  cancel() {
    return this.modalCtrl.dismiss({
      data: 'Cancele',
      role:'cancel',
      posicion: null});
  }

  confirm() {
    let fotos = [];
    fotos.push(...this.fotografiasArray);
    fotos.push(...this.fotosArrayAgregar)
    this.productoForm.get('fotografia').setValue(fotos);

    this.productoForm.get('cantidad_disponibles').setValue(this.productoDatos.data ? this.productoDatos.data.cantidad_disponibles : this.productoForm.get('existencia').value);

    if (this.productoForm.valid) {
      return this.modalCtrl.dismiss({
        data: this.productoForm.value,
        role:'confirm',
        posicion: this.productoDatos.id
      });
    }
  }

  verificarActivo(evento) {

      this.productoForm.get('activo').setValue(evento.detail.checked == false ? 0 : 1);

  }

  asignarValores() {
    console.log('estoy asignando')
    
    this.productoForm.patchValue({
      concepto: this.productoDatos.data.concepto,
      precio: this.productoDatos.data.precio,
      existencia: this.productoDatos.data.existencia,
      cantidad_disponibles: this.productoDatos.data.cantidad_disponibles,
      descripcion_concepto: this.productoDatos.data.descripcion_concepto,
      fotografia: this.productoDatos.data.fotografia,
      porcentaje_descuento: this.productoDatos.data.porcentaje_descuento,
      codigo_postal: this.productoDatos.data.codigo_postal,
      id_organizacion: this.productoDatos.data.id_organizacion,
      activo: this.productoDatos.data.activo == 1 ? true : false,
    })
    
    this.fotografiasArray = this.productoDatos.data.fotografia;
    this.fotografiasArray = this.fotografiasArray.map(foto => {
        // Iteramos sobre cada propiedad del objeto
        for (const prop in foto) {
          // Verificamos si el valor es igual a la cadena "null" y lo convertimos a null
          if (foto[prop] === "null") {
            foto[prop] = null;
          }
        }
        return foto;
    });
    
    this.subioimg = this.fotografiasArray.length > 0 || this.fotosArrayAgregar.length > 0 ? true : false;
    this.numeroFotos = this.fotografiasArray.length;
    console.log('asignados',this.fotografiasArray,this.productoForm.value)
  }

  public borrarFotoEdit(posicion: number) {
    this.fotografiasArray.splice(posicion, 1);
    this.numeroFotosEdit--;
    if (this.numeroFotosEdit < 3) {
      this.galeriaFull = false;
    }
  }

  public agregarFoto(event) {
    let nombre_archivo;
    if (event.target.files && event.target.files.length) {
      let height;
      let width;
      for (const archivo of event.target.files) {
        const reader = this._utils_cls.getFileReader();
        reader.readAsDataURL(archivo);
        reader.onload = () => {
          nombre_archivo = archivo.name;
          const img = new Image();
          img.src = reader.result as string;
          img.onload = () => {
            height = img.naturalHeight;
            width = img.naturalWidth;
            if (width === 400 && height === 400) {
              const file_name = archivo.name;
              const file = archivo;
              if (file.size < 3145728) {
                let file_64: any;
                const utl = new UtilsCls();
                utl.getBase64(file).then(
                    data => {
                      const archivo = new ArchivoComunModel();
                      if (file_name != null) {
                        archivo.nombre_archivo = this._utils_cls.convertir_nombre(file_name);
                        archivo.archivo_64 = file_64;
                      }
                      this.fotosArrayAgregar.push(archivo);
                    this.numeroFotos++;
                    this.subioimg = this.fotografiasArray.length > 0 || this.fotosArrayAgregar.length > 0 ? true : false;
                      if (this.numeroFotos >= this.numeroFotosPermitidas) {
                        this.galeriaFull = true;
                      }
                    }
                );
              } else {
                this.notificaciones.alerta('El tama\u00F1o m\u00E1ximo de archivo es de 3 Mb, por favor intente con otro archivo');
              }
            } else {
              this.resizeToWidth = 400;
              this.resizeToHeight = 400;
              this.abrirModal(img.src, this.resizeToWidth, this.resizeToHeight).then(r => {
                    if (r !== undefined) {
                      const archivo = new ArchivoComunModel();
                      archivo.nombre_archivo = nombre_archivo,
                          archivo.archivo_64 = r.data;
                      this.fotosArrayAgregar.push(archivo);
                      this.numeroFotos++;
                      if (this.numeroFotos >= this.numeroFotosPermitidas) {
                        this.galeriaFull = true;
                      }
                    }
                  }
              );
            }
          };
        };
      }
    }
  }

  public borrarFoto(posicion: number) {
    this.fotosArrayAgregar.splice(posicion, 1);
    this.numeroFotos--;
    this.subioimg = this.fotografiasArray.length > 0 || this.fotosArrayAgregar.length > 0? true : false;
  }
  
  async obtenerImg(){
    if (this.bandera === true){
      this.mensaje = "(Inténtelo de nuevo)"
    }

    const result = await FilePicker.pickImages({
      multiple: false,
      readData: true
    });
    this.bandera = false;
    this.mensaje = null;

    // const contents = await Filesystem.readFile({
    //   path: result.files[0].path,
    // });

    let imgPrueba = `data:image/png;base64,${result.files[0].data}`

    this.resizeToWidth = 400;
    this.resizeToHeight = 400;
    this.abrirModal(imgPrueba, this.resizeToWidth, this.resizeToHeight).then(r => {
      if (r !== undefined) {
        const archivo = new ArchivoComunModel();
        archivo.nombre_archivo = result.files[0].name,
        archivo.archivo_64 = r.data;
        this.fotosArrayAgregar.push(archivo);
        this.numeroFotos++;
        this.subioimg = this.fotografiasArray.length > 0 || this.fotosArrayAgregar.length > 0 ? true : false;
        console.log('asdfasdfa',this.fotografiasArray,this.fotosArrayAgregar)
        if (this.numeroFotos >= this.numeroFotosPermitidas) {
          this.galeriaFull = true;
        }
          }
        }
    );
  }

  async abrirModal(evento, width, heigh) {
    const modal = await this.modalCtrl.create({
      component: RecorteImagenComponent,
      cssClass: 'my-custom-class',
      componentProps: {
        imageChangedEvent: evento,
        resizeToWidth: width,
        resizeToHeight: heigh,
        IdInput: 'imageUpload'
      }
    });
    await modal.present();
    const { data } = await modal.onDidDismiss().then(r => {
      return r;
    }
    );
    return data;
  }

  
  obtenerAfiliaciones() {
    this.personaService.obtenerAfiliaciones().subscribe(res => {
      if (res.code == 200) {
        console.log('Afiliaciones', res)
        this.lstOrg = res.data;
      }
    }),error => {
          console.log(error)
    }
  }

}
