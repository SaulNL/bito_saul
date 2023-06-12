import { Component, OnInit } from "@angular/core";
import { UtilsCls } from "../../utils/UtilsCls";
import { SideBarService } from "../../api/busqueda/side-bar-service";
import { Auth0Service } from "../../api/busqueda/auth0.service";
import { Router } from "@angular/router";
import { Platform, AlertController } from '@ionic/angular';
import {AfiliacionPlazaModel} from "../../Modelos/AfiliacionPlazaModel";
import { NotificacionesService } from "src/app/api/usuario/notificaciones.service";
import moment from "moment";
import { AdministracionService } from "src/app/api/administracion-service.service";
import { FiltroCatVariableModel } from './../../Modelos/catalogos/FiltroCatVariableModel';

@Component({
  selector: "app-tabs",
  templateUrl: "tabs.page.html",
  styleUrls: ["tabs.page.scss"],
  providers: [UtilsCls, SideBarService, Auth0Service],
})
export class TabsPage implements OnInit {
  existeSesion: boolean;
  usuario: any;
  activedPage: string;
  public isIos: boolean;
  public isAndroid: boolean;
  private plazaAfiliacion: AfiliacionPlazaModel | null;
  public misNotificaciones: any;
  public notifSinLeer :number = + localStorage.getItem("notifSinLeer");
  public id_proveedor:any;
  showPopUp: boolean=false;
  showPopUpGracias: boolean = false;
  popUpTitle: string;
  popUpDescrip: string;
  infoPersona: any;
  misEncuestas: any=[];
  hayEncuesta:boolean=false
  contesto: boolean=false;
  filtroVariable : FiltroCatVariableModel= new FiltroCatVariableModel
  mensajeRespondio: string;
  idProveedor: number;
  idPersona: number;

  constructor(
      private util: UtilsCls,
      private sideBarService: SideBarService,
      private router: Router,
      private auth0: Auth0Service,
      private platform: Platform,
      public alertController: AlertController,
      private notificacionesServide : NotificacionesService, 
      private AdministracionService : AdministracionService
  ) {
    this.existeSesion = util.existe_sesion();
    this.activedPage = "";
    this.isIos = this.platform.is('ios');
    this.isAndroid = (this.platform.is('android'));
  }

  ngOnInit(): void {
    this.plazaAfiliacion = JSON.parse(localStorage.getItem("org"));
    this.sideBarService.getObservable().subscribe((data) => {
      this.usuario = this.util.getData();
    });
    this.sideBarService.change.subscribe((isOpen) => {
      this.usuario = this.auth0.getUserData();
    });
    this.usuario = this.util.getData();
    const pagina = localStorage.getItem('activedPage');
    const prod = localStorage.getItem('productos');
    const neg = localStorage.getItem('negocios');

    if (this.usuario !== null) this.obtenerNotificaciones();
    
    //this.actualizarNotificaciones();
    this.actualizarEncuestas();

    if (neg === 'active' && this.isIos){
      this.activedPage = 'inicio';
    }
    if (prod === 'active' && this.router.navigate(['/tabs/productos'], {
      queryParams: {
        special: true
      }
    }) && this.isIos){
      this.activedPage = 'productos';
      
    }

    if(pagina==='promociones'){
      this.activedPage = localStorage.getItem("activedPage");
    }

    if(pagina==='productos'){
      this.activedPage = localStorage.getItem("activedPage");
      this.mostrarLoguearse();
    }

    if(pagina==='perfil' && this.isAndroid ){
      this.activedPage = localStorage.getItem("activedPage");
    }

    localStorage.removeItem('activedPage');
    localStorage.removeItem('productos');
  }

  inicio() {
    localStorage.removeItem("productos");
    localStorage.removeItem("activedPage");
    localStorage.setItem('isRedirected', 'false');
    localStorage.removeItem("byCategorias");
    this.router.navigate(["/tabs/inicio"], {
      queryParams: { buscarNegocios: "buscar" },
    });
    localStorage.setItem("resetFiltro", "0");
    localStorage.setItem("activedPage", "inicio");
    this.activedPage = localStorage.getItem("activedPage");
    localStorage.setItem('negocios',('active'));
    localStorage.removeItem("activarTodos")
    if(localStorage.getItem("idGiro") === null ) {
      localStorage.removeItem("todo");
    }
  }

  promociones() {
    localStorage.removeItem("activedPage");
    localStorage.removeItem("byCategorias");
    localStorage.setItem("isRedirected", "false");
    this.router.navigate(["/tabs/promociones"]);
    localStorage.setItem("resetFiltro", "0");
    localStorage.setItem("activedPage", "promociones");
    this.activedPage = localStorage.getItem("activedPage");
    localStorage.removeItem("productos");
  }
  solicitudes() {
    localStorage.removeItem("activedPage");
    localStorage.removeItem("byCategorias");
    this.router.navigate(["/tabs/mis-favoritos"]);
    localStorage.setItem("activedPage", "favoritos");
    this.activedPage = localStorage.getItem("activedPage");
    // this.router.navigate(['/tabs/home/solicitud']);
    localStorage.removeItem("productos");
  }

  productos() {
    localStorage.removeItem("activedPage");
    localStorage.removeItem("byCategorias");
    localStorage.setItem("isRedirected", "false");
    this.router.navigate(["/tabs/productos"]);
    localStorage.setItem("resetFiltro", "0");
    localStorage.setItem("activedPage", "productos");
    this.activedPage = localStorage.getItem("activedPage");
    this.mostrarLoguearse();
    localStorage.removeItem("productos");
  }

  requerimientos() {
    localStorage.removeItem("activedPage");
    localStorage.removeItem("byCategorias");
    this.router.navigate(["/tabs/home/solicitud"]);
    localStorage.setItem("activedPage", "requerimientos");
    this.activedPage = localStorage.getItem("activedPage");
    localStorage.removeItem("productos");
  }

  perfil() {
    localStorage.removeItem("activedPage");
    localStorage.removeItem("byCategorias");
    localStorage.setItem("isRedirected", "false");
    localStorage.setItem("resetFiltro", "0");
    this.router.navigate(["/tabs/home/perfil"], {
      queryParams: { special: true },
    });
    localStorage.setItem("activedPage", "perfil2");
    this.activedPage = localStorage.getItem("activedPage");
    localStorage.removeItem("productos");
    localStorage.removeItem("negocios");
    localStorage.removeItem("todo");
  }
  login() {
    localStorage.removeItem("byCategorias");
    localStorage.setItem("isRedirected", "false");
    this.router.navigate(["/tabs/login"]);
    localStorage.setItem("activedPage", "perfil");
    this.activedPage = localStorage.getItem("activedPage");
    localStorage.removeItem("productos");
  }

  public mostrarLoguearse(){
    if (this.existeSesion) {
    }else{
      if(this.plazaAfiliacion != null){

      }else{
        setTimeout(() =>{
          this. mensajeRegistro();
        },3800);
      }
    }
}

  async mensajeRegistro() {
    const alert = await this.alertController.create({
      header: 'Bitoo!',
      message: "¿Ya tienes una cuenta?",
        buttons: [
            {
                text: "Iniciar sesión",
                cssClass: 'text-grey',
                handler: () => {
                  this.router.navigate(['/tabs/login']);
                }
            },
            {
                text: "Registrate",
                cssClass: 'text-rosa',
                handler: () => {
                    this.router.navigate(["/tabs/login/sign-up"]);
                },
            },
        ],
    });
    await alert.present();
  }

  obtenerNotificaciones() {
    this.idProveedor = null;
    this.idPersona = null;
  
    if (this.usuario.proveedor) {
      this.idProveedor = this.usuario.proveedor.id_proveedor;
      this.idPersona = this.usuario.proveedor.id_persona;
    } else {
      this.idPersona = this.usuario.id_persona;
    }
  
    setInterval(() => {
      this.servicioNotificaciones();
    }, 5000);
  
  }
  
  servicioNotificaciones() {
    this.notificacionesServide.obtenerNotificaciones(this.idProveedor, this.idPersona).subscribe(
      response => {
        if (response.code === 200){
          this.misNotificaciones = response.data;
          console.log("servicio notificacione tabs");
  
          console.log(JSON.stringify(this.misNotificaciones));
          this.notificacionesSinAbrir();
        }
      },
      error => {
      }
    );
  }
  
  notificacionesSinAbrir(){
    const sumaNoleidos = this.misNotificaciones.map(item => item.no_leidos).reduce((prev, curr) => prev + curr, 0);
  
    localStorage.setItem('notifSinLeer', sumaNoleidos);
  
    console.log(JSON.stringify(localStorage.getItem('notifSinLeer')));
    this.notifSinLeer = +localStorage.getItem('notifSinLeer');
  }

  actualizarNotificaciones(){
    setInterval(( ) => {
        //this.obtenerNotificaciones();
    }, 30000);
  }
  async actualizarEncuestas(){
    this.filtroVariable.variable = 'intervaloTiempoPreguntaRapida';

    await this.AdministracionService.obtenerVariable(this.filtroVariable).subscribe(response =>{
      let valor;
      if (response.data === undefined || response.data.length === 0) {
        valor = null;
      }else{
        valor = response.data[0];
        localStorage.setItem('valorMostrarEncuesta', JSON.stringify(valor.valor));
        let valorMostrarEncuesta = Number(localStorage.getItem('valorMostrarEncuesta')) * 60;
        if (valorMostrarEncuesta === 0){
          valorMostrarEncuesta = 60;
        }
        setInterval(( ) => {
          this.obtenerEncuestas();
        }, valorMostrarEncuesta * 1000);
      }
    });
  }
  obtenerEncuestas(){
    this.contesto=false;
    this.showPopUpGracias=false
    let infoPersona = JSON.parse(localStorage.getItem('u_sistema'))
    if(infoPersona!=null && infoPersona!=""){
      //console.log("existe id_persona: "+infoPersona.id_persona)
      this.notificacionesServide.obtenerEncuestas(infoPersona.id_persona).subscribe(
        response => {
          //console.log("obtenerEncuestas = \n"+JSON.stringify(response))
          if (response.code === 200){  
            if(response.data.length > 0){
              this.misEncuestas= response.data[0];              
              //this.misEncuestas.opciones.pop()                   
              if(this.misEncuestas.hasOwnProperty("id_pregunta_rapida") && this.misEncuestas != undefined){
                //console.log("existe id_pregunta_rapida? "+this.misEncuestas.hasOwnProperty("id_pregunta_rapida"))
                this.hayEncuesta=true;
                //console.log("mi Encuesta = \n"+ JSON.stringify(this.misEncuestas))  

                this.showPopUp=true;
                setTimeout(() => {
                  this.closePopUp()
                }, (this.misEncuestas.duracion_pantalla*1000));
                
              }else{
                console.log("No existe id_pregunta_rapida: ")
                this.hayEncuesta=false;
              } 
            }                             
          }else{
            
          }                     
        },
        error => {
          console.log("error:"+error.message)
        }        
      );
    }else{
      //console.log("NO existe infoPersona")
    }     
  }  

  async enviarRespuesta(id_pregunta_rapida:number,id_opcion_pregunta_rapida: number){
    this.closePopUp()
    let infoPersona = JSON.parse(localStorage.getItem('u_sistema'))
    let fecha_respuestas = moment().format('YYYY/MM/DD');
    /*console.log("id_pregunta_rapida: "+id_pregunta_rapida+"\n"+
    "id_opcion_pregunta_rapida: "+id_opcion_pregunta_rapida+"\n"+
    "infoPersona: "+infoPersona.id_persona+"\n"+
    "fecha_respuestas: "+fecha_respuestas)*/
    await this.notificacionesServide.guardarRespuestaEncuesta(id_pregunta_rapida,infoPersona.id_persona,id_opcion_pregunta_rapida,fecha_respuestas).subscribe(
      response => {
        if (response.code === 200){   
          this.mensajeRespondio = this.misEncuestas.mensaje;       
          //console.log("Respuesta codigo 200 "+JSON.stringify(response)+ " Mensjae de respuesta= "+this.mensajeRespondio)          
          this.contesto=true;          
          this.showPopUpGracias=true;
          setTimeout(() => {
            this.closePopUpGracias()
          },5000);
          
        }else{
          //console.log("No se guardo codigo "+response.code)
        }           
      },
      error => {
        //console.log("No se guardo error")
      }
    );
  }
  closePopUp(){
    //console.log("Cerró el popup Encuesta")
    this.showPopUp=false;    
  }  

  closePopUpGracias(){
    //console.log("Cerró el popup Gracias")
    this.showPopUpGracias=false;    
  }  
}
