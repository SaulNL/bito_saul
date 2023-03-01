import { PopOverVisitsComponent } from './../../components/pop-over-visits/pop-over-visits.component';
import { PopoverController } from '@ionic/angular';
import { Location } from '@angular/common';
import { CreateObjects } from './../../helper/create-object';
import { ValidatorData } from './../../helper/validations';
import { NegocioService } from './../../../api/negocio.service';
import { StatisticsFilterInterface, StatisticsFilterModel } from './../../models/filters-model';
import { StatisticsByBusinessInterface, BusinessStatisticsLoaderInterface, BusinessStatisticsLoaderModel, BusinessStatisticsInterface, BusinessStatisticsModel } from './../../models/statistic-model';
import { Params } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import Moment from 'moment';
import { ToadNotificacionService } from './../../../api/toad-notificacion.service';
import { GeneralServicesService } from 'src/app/api/general-services.service';
import * as Chart from 'chart.js'
@Component({
  selector: 'app-statistics-by-business',
  templateUrl: './statistics-by-business.page.html',
  styleUrls: ['./statistics-by-business.page.scss'],
  providers: [ValidatorData, CreateObjects]
})
export class StatisticsByBusinessPage implements OnInit {
  public loader: BusinessStatisticsLoaderInterface;
  public filters: StatisticsFilterInterface;
  public statistics: BusinessStatisticsInterface;
  public selected: string;
  public selectedPlus: string;
  public filter: StatisticsFilterInterface //= new StatisticsFilterModel(this.filters.id_negocio);
  features16: boolean;
  vistaTipos: any[] = [];
  requests: any[] = [];
  promotions: any[] = [];
  products: any[];
  private grafica :Chart;
  //@ViewChild("myChart") canvas: HTMLCanvasElement;
  canvas : any
  datosGrafica = {
    labels:[],
    data:[]
  };
  chartType = "pie";

  /*viitasQRData:any

  visitasQr = {
    data: [],
    labels:[]
  }
  visitasUrl = {
    data: [],
    labels: []
  }
  likesNegocio = {
    data: [],
    labels: []
  }*/

  dataGraficas={
    dataVisistasQR:{
      data:{},
      tagsTooltip:[]
    },
    dataVisitasUrl:{
      data:{},
      tagsTooltip:[]
    },
    dataLikesNegocio:{
      data:{},
      tagsTooltip:[]
    },
    dataReqCompra:{
      data:{},
      tagsTooltip:[]
    },
    dataPromociones:{
      data:{},
      tagsTooltip:[]
    },
    dataLikesProducts:{
      data:{},
      tagsTooltip:[]
    },
    dataCalificaciones:{}
  }

  ratingData:any;

  requestsData:any

  promotionsData:any

  likesProductosData : any

  tipoEstadistica: string =null;
  showToggle: boolean;
  dataSet: string;
  //options: {};
  
  constructor(
    private _general_service: GeneralServicesService,
    private activated: ActivatedRoute,
    private business: NegocioService,
    private create: CreateObjects,
    private toadNotificacion: ToadNotificacionService,
    private location: Location,
    private popOver: PopoverController,
    private validator: ValidatorData,
    private ref: ChangeDetectorRef
  ) {
    this.initConstructor();
  }

  ngOnInit() {
    this.activated.queryParams.subscribe(
      (params: Params) => {
        if (params.business) {
          this.initConstructor();
          const contentStatisticsByBusiness: StatisticsByBusinessInterface = JSON.parse(params.business);
          this.init(contentStatisticsByBusiness.idBusiness);
          this.obtenerFeatures(contentStatisticsByBusiness.idBusiness)
          this.filter = new StatisticsFilterModel(contentStatisticsByBusiness.idBusiness);        
        } else {

        }
      }
    );
    this.ref.detectChanges();
    //this.generarGrafico();
  }
  generarGraficoBarras(datos:any){
    if(this.grafica){
      this.grafica.clear();
      this.grafica.destroy();
    }
    const canvas = document.getElementById('myChart');
    const ctx = (canvas as HTMLCanvasElement).getContext('2d');
    var backgrounds = []
    var borders = []
    datos.data.forEach(dato => {
      var color = this.backgroundColorGenerator()
      backgrounds.push(color+"0.2"+")");
      borders.push(color+"1"+")")
    });
    this.grafica = new Chart(ctx, {
      type: 'bar',
      data: {
          labels: datos.labels,
          datasets: [{
              label: 'Número de vistas',
              data: datos.data,
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],//backgrounds,
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],//borders,
          }]
      },
      options: {
        
      }
  });
  }
  genBarChartDynamic(data:any,tooltipTags?:any[]){
    console.log("genBarChartDynamic")
    if(this.grafica){
      this.grafica.clear();
      this.grafica.destroy();
    }
    const canvas = document.getElementById('myChart');
    const ctx = (canvas as HTMLCanvasElement).getContext('2d');
    this.grafica = new Chart(ctx, {
      type: 'bar',
      data: data,
      options:!tooltipTags? { } : 
      {
        tooltips: {
          callbacks: {
              label: (ctx)=>{
                //console.log("index: "+(ctx.index!=0?ctx.index:0))
                var tag = tooltipTags[ctx.index!=0?ctx.index:0]
                return tag
              }
          }
        }
      }
    });
  }
  genPieChartDynamic(data:any,tooltipTags?:any[]){
    console.log("genPieChartDynamic")
    if(this.grafica){
      this.grafica.clear();
      this.grafica.destroy();
    }
    const canvas = document.getElementById('myChart');
    const ctx = (canvas as HTMLCanvasElement).getContext('2d');
    this.grafica = new Chart(ctx, {
      type: 'pie',
      data: data,
      options:!tooltipTags? { } : 
      {
        tooltips: {
          callbacks: {
              label: (ctx)=>{
                //console.log("index: "+(ctx.index!=0?ctx.index:0))
                var tag = tooltipTags[ctx.index!=0?ctx.index:0]
                return tag
              }
          }
        }
      }
    });
  }
  generarGraficoPastel(datos:any){
    if(this.grafica){
      this.grafica.clear();
      this.grafica.destroy();
    }
    this.grafica = null;
    const canvas = document.getElementById('myChart');
    const ctx = (canvas as HTMLCanvasElement).getContext('2d');
    var backgrounds = []
    var borders = []
    datos.data.forEach(dato => {
      var color = this.backgroundColorGenerator()
      backgrounds.push(color+"0.2"+")");
      borders.push(color+"1"+")")
    });
    this.grafica = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: datos.labels,
        datasets: [{
            label: 'Número de vistas',
            data: datos.data,
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)'
          ],//backgrounds,
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)'
          ],//borders,
            borderWidth: 1
        }]
    },
      options: {
      }
  });
  }
  toggleGrafica(){
    if(this.dataSet=="URL"){
      console.log("es URL")
      if(this.chartType == "bar"){
        this.chartType = "pie"
        this.genBarChartDynamic(this.dataGraficas.dataVisitasUrl.data,this.dataGraficas.dataVisitasUrl.tagsTooltip)
      }else if(this.chartType == "pie"){
        this.chartType = "bar"
       this. genPieChartDynamic(this.dataGraficas.dataVisitasUrl.data,this.dataGraficas.dataVisitasUrl.tagsTooltip)
      }
    }
    if(this.dataSet=="QR"){
      console.log("es URL")
      if(this.chartType == "bar"){
        this.chartType = "pie"
        this.genBarChartDynamic(this.dataGraficas.dataVisistasQR.data,this.dataGraficas.dataVisistasQR.tagsTooltip)
      }else if(this.chartType == "pie"){
        this.chartType = "bar"
       this. genPieChartDynamic(this.dataGraficas.dataVisistasQR.data,this.dataGraficas.dataVisistasQR.tagsTooltip)
      }
    }
    if(this.dataSet=="likesNegocio"){
      console.log("es likesNegocio")
      if(this.chartType == "bar"){
        this.chartType = "pie"
        this.genBarChartDynamic(this.dataGraficas.dataLikesNegocio.data,this.dataGraficas.dataLikesNegocio.tagsTooltip)
      }else if(this.chartType == "pie"){
        this.chartType = "bar"
       this. genPieChartDynamic(this.dataGraficas.dataLikesNegocio.data,this.dataGraficas.dataLikesNegocio.tagsTooltip)
      }
    }
    if(this.dataSet=="requerimientos"){
      console.log("es requerimientos")
      if(this.chartType == "bar"){
        this.chartType = "pie"
        this.genBarChartDynamic(this.dataGraficas.dataReqCompra.data,this.dataGraficas.dataReqCompra.tagsTooltip)
      }else if(this.chartType == "pie"){
        this.chartType = "bar"
       this. genPieChartDynamic(this.dataGraficas.dataReqCompra.data,this.dataGraficas.dataReqCompra.tagsTooltip)
      }
    }
    if(this.dataSet=="promociones"){
      console.log("es dataPromociones")
      if(this.chartType == "bar"){
        this.chartType = "pie"
        this.genBarChartDynamic(this.dataGraficas.dataPromociones.data,this.dataGraficas.dataPromociones.tagsTooltip)
      }else if(this.chartType == "pie"){
        this.chartType = "bar"
       this. genPieChartDynamic(this.dataGraficas.dataPromociones.data,this.dataGraficas.dataPromociones.tagsTooltip)
      }
    }
    if(this.dataSet=="likesProductos"){
      console.log("es likesProductos")
      if(this.chartType == "bar"){
        this.chartType = "pie"
        this.genBarChartDynamic(this.dataGraficas.dataLikesProducts.data,this.dataGraficas.dataLikesProducts.tagsTooltip)
      }else if(this.chartType == "pie"){
        this.chartType = "bar"
       this. genPieChartDynamic(this.dataGraficas.dataLikesProducts.data,this.dataGraficas.dataLikesProducts.tagsTooltip)
      }
    }
  }
  generarNumero(numero){
    return (Math.random()*numero).toFixed(0);
  }
  
  backgroundColorGenerator(){

    var coolor = "("+this.generarNumero(255)+"," + this.generarNumero(255) + "," + this.generarNumero(255) ;//+"0.2"+")"
    
    return "rgba" + coolor;
  }
  borderColorGenerator(){
    var coolor = "("+this.generarNumero(255)+"," + this.generarNumero(255) + "," + this.generarNumero(255) +"1"+")";
    return "rgba" + coolor;
  }
  /**
   * @author Juan Antonio Guevara Flores
   * @description Activar el filtro para buscar
   * @param value
   */
  public activetedFilter(value: string) {
    const moment = Moment();
    const day = moment.format(Moment.HTML5_FMT.DATE);
  
    try {
      switch (value) {
        case 'day':
          this.filter.fecha_inicio = day;
          this.filter.fecha_final = day;
          this.selected = 'day';
          this.activatedFilter(this.filter);
          break;
        case 'week':
          this.selected = 'week';
          this.filter.fecha_inicio = Moment().subtract(7, 'd');
          this.filter.fecha_final = day;
          this.activatedFilter(this.filter);
          break;
        case 'month':
          this.selected = 'month';
          this.filter.fecha_inicio = Moment().subtract(30, 'd');
          this.filter.fecha_final = day;
          this.activatedFilter(this.filter);
          break;
        case 'all':
          this.selected = 'all';
          this.filter.fecha_inicio = null;
          this.filter.fecha_final = null;
          this.activatedFilter(this.filter);
          break;
        default:
          this.selected = 'all';
          this.filter.fecha_inicio = null;
          this.filter.fecha_final = null;
          this.activatedFilter(this.filter);
          break;
      }
    } catch (error) {
      this.filter.fecha_inicio = null;
      this.filter.fecha_final = null;
      this.activatedFilter(this.filter);
    }
  }
  public filtroPlus(value: string) {    
    try {
      switch (value) {
        case 'edad':
          this.filter.tipo = "edad";
          this.selectedPlus = "edad"
          this.activatedFilter(this.filter)
          break;
        case 'genero':
          this.filter.tipo = "genero";
          this.selectedPlus = "genero"
          this.activatedFilter(this.filter)
          break;
        case 'localidad':
          this.filter.tipo = "localidad";
          this.selectedPlus = "localidad"
          this.activatedFilter(this.filter)
          break;
        case 'todos':
          this.filter.tipo = null;
          this.selectedPlus = "todos"
          this.activatedFilter(this.filter)
          break;
        default:
          this.filter.tipo = null;  
          this.activatedFilter(this.filter)
          break;
      }
    } catch (error) {
      this.filter.fecha_inicio = null;
      this.filter.fecha_final = null;
      this.filter.tipo = null;
      this.activatedFilter(this.filter)
    }
  }
  /**
   * @author Juan Antonio Guevara Flores
   * @description Regresar a la page de Estadisticas
   */
  public closeStatistic() {
    this.location.back();
  }

  /**
   * @author Juan Antonio Guevara Flores
   * @description Abre el PopOverVisitsComponent para visualizar las visitas
   * @param event
   */
  async visists(event: any) {
    const popOver = await this.popOver.create({
      component: PopOverVisitsComponent,
      event: event,
      translucent: true,
      componentProps: {
        visitsByQr: this.statistics.totalVisitsByQr,
        visitsByUrl: this.statistics.totalVisitsByUrl
      }
    });
    await popOver.present();
  }
  /**
   * @author Juan Antonio Guevara Flores
   * @description Inicializa el contructor
   */
  private initConstructor() {
    this.selected = 'all';
    this.loader = new BusinessStatisticsLoaderModel();
    this.statistics = new BusinessStatisticsModel();
  }
  /**
   * @author Juan Antonio Guevara Flores
   * @description Inicializa los filtros como nulos
   * @param idBusiness
   */
  private init(idBusiness: number) {
    this.filters = new StatisticsFilterModel(idBusiness);
    this.activatedFilter(this.filters);
  }

  /**
   * @author Juan Antonio Guevara Flores
   * @description Inicia los Servicios
   * @param filter
   */
  private activatedFilter(filter: StatisticsFilterInterface) {
    if(this.grafica){
      this.grafica.clear();
    }
    this.tipoEstadistica =null;
    console.log(JSON.stringify(filter))
    this.getVisitsByQr(filter);//OK
    this.getVisitsByUrl(filter);//OK
    this.getLikesBusiness(filter);
    this.getCompanyRating(filter);
    this.getRequests(filter);
    this.getPromotions(filter);
    this.getLikesProducts(filter);
  }

  /**
   * @author Juan Antonio Guevara Flores
   * @description Obtiene las visitas por Qr
   * @param filters
   */
  private getVisitsByQr(filters: StatisticsFilterInterface) {
    this.loader.loadingVisitsByQr = true;
    /*var edades = []
    var localidades =[]
    var genero =[]*/
    this.business.estadisticaVisitasQR(filters).subscribe(
      response => {
        this.statistics.totalVisitsByQr = this.create.anyToNumber(response.data.numero_visto);
        this.loader.loadingVisitsByQr = false;
        //console.log("Estadisticas por visitas QR: "+JSON.stringify(response))

        var vistaTipos = response.data.datos
        var labels=[]
        var data = []
        var tags = []
        vistaTipos.forEach(tipo => {
            if(filters.tipo == "localidad"){
              labels.push(tipo.municipio+" "+tipo.estado)
              data.push(tipo.total)
              tags.push(tipo.municipio+" "+tipo.estado+": "+tipo.total+" vistas")
            }
            else if(filters.tipo == "edad"){
              labels.push(tipo.edad + " años")
              data.push(tipo.total)
              tags.push(tipo.edad+" "+"años"+": "+tipo.total+" vistas")
            }
            else if(filters.tipo == "genero"){
              labels.push(tipo.genero)
              data.push(tipo.total)
              tags.push(tipo.genero+": "+tipo.total+" vistas")
            }    
        });
        this.dataGraficas.dataVisistasQR={
          data:{
            labels: labels,
            datasets: [{
                label: 'Visitas por QR',
                data: data,
                backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(255, 159, 64, 0.2)',
                  'rgba(255, 205, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(201, 203, 207, 0.2)'
                ],
                borderColor: [
                  'rgb(255, 99, 132)',
                  'rgb(255, 159, 64)',
                  'rgb(255, 205, 86)',
                  'rgb(75, 192, 192)',
                  'rgb(54, 162, 235)',
                  'rgb(153, 102, 255)',
                  'rgb(201, 203, 207)'
                ],
            }]
          },
          tagsTooltip : tags,
      }
        /*this.vistaTipos = response.data.datos
        //console.log("La lista de resultados por el tipo --> "+filters.tipo+" es:\n"+JSON.stringify(this.vistaTipos))
        this.datosGrafica.data= []
        this.datosGrafica.labels=[]
        this.visitasQr.data=[]
        this.visitasQr.labels=[]
        console.log("filter.tipo= "+filters.tipo)
        this.vistaTipos.forEach(tipo => {
            if(filters.tipo == "localidad"){
              localidades.push(tipo.municipio)   
              this.visitasQr.data.push(tipo.total)
              this.visitasQr.labels.push(tipo.municipio+" "+tipo.estado)           
            }else if(filters.tipo == "edad"){              
              edades.push(tipo.edad)
              this.visitasQr.data.push(tipo.total)
              this.visitasQr.labels.push(tipo.edad + " años")
            }else if(filters.tipo == "genero"){
              genero.push(tipo.genero)
              this.visitasQr.labels.push(tipo.genero)
              this.visitasQr.data.push(tipo.total)
            } 
        });*/
      },
      () => {
        this.loader.loadingVisitsByQr = false;
        this.notificationError('Visitas por Qr');
      }
    );
  }
  /**
   * @author Juan Antonio Guevara Flores
   * @description Obtiene la visitas por url
   * @param filters
   */
  async  getVisitsByUrl(filters: StatisticsFilterInterface) {
    this.loader.loadingVisitsByUrl = true;
    /*var total=0;
    var edades = []
    var localidades =[]
    var genero =[]*/
    await this.business.estadisticaVisitasURL(filters).subscribe(
      response => {
        this.statistics.totalVisitsByUrl = this.create.anyToNumber(response.data.numero_visto);
        this.loader.loadingVisitsByUrl = false;
        this.vistaTipos = response.data.datos
        //console.log("Estadisticas por visitas URL: "+JSON.stringify(response))
        var vistaTipos = response.data.datos
        var labels=[]
        var data = []
        var tags = []
        vistaTipos.forEach(tipo => {
            if(filters.tipo == "localidad"){
              labels.push(tipo.municipio+" "+tipo.estado)
              data.push(tipo.total)
              tags.push(tipo.municipio+" "+tipo.estado+": "+tipo.total+" vistas")
            }
            else if(filters.tipo == "edad"){
              labels.push(tipo.edad + " años")
              data.push(tipo.total)
              tags.push(tipo.edad+" "+"años"+": "+tipo.total+" vistas")
            }
            else if(filters.tipo == "genero"){
              labels.push(tipo.genero)
              data.push(tipo.total)
              tags.push(tipo.genero+": "+tipo.total+" vistas")
            }    
        });
        this.dataGraficas.dataVisitasUrl={
          data:{
            labels: labels,
            datasets: [{
                label: 'Visitas por URL ',
                data: data,
                backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(255, 159, 64, 0.2)',
                  'rgba(255, 205, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(201, 203, 207, 0.2)'
                ],
                borderColor: [
                  'rgb(255, 99, 132)',
                  'rgb(255, 159, 64)',
                  'rgb(255, 205, 86)',
                  'rgb(75, 192, 192)',
                  'rgb(54, 162, 235)',
                  'rgb(153, 102, 255)',
                  'rgb(201, 203, 207)'
                ],
            }]
          },
          tagsTooltip : tags,
      }
        /*this.datosGrafica.data= []
        this.datosGrafica.labels=[]
        this.visitasUrl.data=[]
        this.visitasUrl.labels=[]
        this.vistaTipos.forEach(tipo => {

            if(filters.tipo == "localidad"){
              localidades.push(tipo.municipio)   
              this.visitasUrl.data.push(tipo.total)
              this.visitasUrl.labels.push(tipo.municipio+" "+tipo.estado)           
            }else if(filters.tipo == "edad"){              
              edades.push(tipo.edad)
              this.visitasUrl.data.push(tipo.total)
              this.visitasUrl.labels.push(tipo.edad + " años")
            }else if(filters.tipo == "genero"){
              genero.push(tipo.genero)
              this.visitasUrl.labels.push(tipo.genero)//+" = "+tipo.total)
              this.visitasUrl.data.push(tipo.total)
              //???
            } 
        });*/


      },
      () => {
        this.loader.loadingVisitsByUrl = false;
        this.notificationError('Visitas por URL');
      }
    );
  }
  /**
   * @author Juan Antonio Guevara Flores
   * @description Obtiene los Likes de un negocio
   * @param filters
   */
  private getLikesBusiness(filters: StatisticsFilterInterface) {
    this.loader.loadingLikesBusiness = true;
    /*var edades = []
    var localidades =[]
    var genero =[]*/
    this.business.estadisticaLikesNegocio(filters).subscribe(
      response => {
        this.statistics.totalLikesBusiness = this.create.anyToNumber(response.data.numero_likes);
        this.loader.loadingLikesBusiness = false;
        //console.log("Estadisticas por likes NEGOCIO: "+JSON.stringify(response))
        var vistaTipos = response.data.datos
        var labels=[]
        var data = []
        var tags = []
        vistaTipos.forEach(tipo => {
            if(filters.tipo == "localidad"){
              labels.push(tipo.municipio+" "+tipo.estado)
              data.push(tipo.total)
              tags.push(tipo.municipio+" "+tipo.estado+": "+tipo.total+" Likes")
            }
            else if(filters.tipo == "edad"){
              labels.push(tipo.edad + " años")
              data.push(tipo.total)
              tags.push(tipo.edad+" "+"años"+": "+tipo.total+" Likes")
            }
            else if(filters.tipo == "genero"){
              labels.push(tipo.genero)
              data.push(tipo.total)
              tags.push(tipo.genero+": "+tipo.total+" Likes")
            }    
        });
        this.dataGraficas.dataLikesNegocio={
          data:{
            labels: labels,
            datasets: [{
                label: 'Likes de negocio',
                data: data,
                backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(255, 159, 64, 0.2)',
                  'rgba(255, 205, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(201, 203, 207, 0.2)'
                ],
                borderColor: [
                  'rgb(255, 99, 132)',
                  'rgb(255, 159, 64)',
                  'rgb(255, 205, 86)',
                  'rgb(75, 192, 192)',
                  'rgb(54, 162, 235)',
                  'rgb(153, 102, 255)',
                  'rgb(201, 203, 207)'
                ],
            }]
          },
          tagsTooltip : tags,
      }
        /*this.vistaTipos = response.data.datos
        this.datosGrafica.data= []
        this.datosGrafica.labels=[]
        this.dataLikesNegocio.data=[]
        this.likesNegocio.labels=[]
        this.vistaTipos.forEach(tipo => {
            if(filters.tipo == "localidad"){
              localidades.push(tipo.municipio)   
              this.likesNegocio.data.push(tipo.total)
              this.likesNegocio.labels.push(tipo.municipio+" "+tipo.estado)           
            }else if(filters.tipo == "edad"){              
              edades.push(tipo.edad)
              this.likesNegocio.data.push(tipo.total)
              this.likesNegocio.labels.push(tipo.edad + " años")
            }else if(filters.tipo == "genero"){
              genero.push(tipo.genero)
              this.likesNegocio.labels.push(tipo.genero)//+" = "+tipo.total)
              this.likesNegocio.data.push(tipo.total)
              //???
            } 
        });*/
      },
      () => {
        this.loader.loadingLikesBusiness = false;
        this.notificationError('Likes por negocio');
      }
    );
  }
  /**
   * @author Juan Antonio Guevara Flores
   * @description Obtiene el las estaditicas de los comentarios de un negocio
   * @param filters
   */
  private getCompanyRating(filters: StatisticsFilterInterface) {
    this.loader.loadingCompanyRating = true;
    this.business.estadisticaComentariosNegocio(filters).subscribe(
      response => {
        if (this.create.anyToNumber(response.data.total_califaciones) !== 0) {
          this.statistics.goodGrade = this.create.anyToNumber(response.data.calificacion_buena);
          this.statistics.averageRating = this.create.anyToNumber(response.data.calificacion_media);
          this.statistics.lowRating = this.create.anyToNumber(response.data.calificacion_baja);
        }
        this.loader.loadingCompanyRating = false;
        var vistaTipos = response.data.datos
        //console.log("Estadisticas por RATING: "+JSON.stringify(response))
        var buenas=[]
        var medias=[]
        var bajas=[]
        var labels=[]
        vistaTipos.forEach(tipo => {
            if(filters.tipo == "localidad"){
              labels.push(tipo.municipio+" "+tipo.estado)

              if(tipo.calificacion<3){
                bajas.push(tipo.total)
              }
              else{
                bajas.push(0)
              }
              if(tipo.calificacion>=3 && tipo.calificacion< 5){
                medias.push(tipo.total)
              }else {
                medias.push(0)
              }
              if(tipo.calificacion > 4){
                buenas.push(tipo.total)
              }else{
                buenas.push(0)
              }
            }else if(filters.tipo == "edad"){
              labels.push(tipo.edad + " años")
              if(tipo.calificacion<3){
                bajas.push(tipo.total)
              }
              else{
                bajas.push(0)
              }
              if(tipo.calificacion>=3 && tipo.calificacion< 5){
                medias.push(tipo.total)
              }else {
                medias.push(0)
              }
              if(tipo.calificacion > 4){
                buenas.push(tipo.total)
              }else{
                buenas.push(0)
              }
            }else if(filters.tipo == "genero"){
              labels.push(tipo.genero)
              if(tipo.calificacion<3){
                bajas.push(tipo.total)
              }
              else{
                bajas.push(0)
              }
              if(tipo.calificacion>=3 && tipo.calificacion< 5){
                medias.push(tipo.total)
              }else {
                medias.push(0)
              }
              if(tipo.calificacion > 4){
                buenas.push(tipo.total)
              }else{
                buenas.push(0)
              }
            }    
            this.ratingData={
              labels: labels,
              datasets: [{
                  label: 'Buena',
                  data: buenas,
                  backgroundColor: [
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                ],
                  borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(75, 192, 192, 1)',
                ],
              },
              {
                label: 'Media',
                data: medias,
                backgroundColor: [
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                ],
                borderColor: [
                  'rgba(255, 206, 86, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(255, 206, 86, 1)',
                ],
                borderWidth: 1
            },
            {
              label: 'Baja',
              data: bajas,
              backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(255, 99, 132, 0.2)',
              ],
              borderColor: [
                  'rgba(255, 99, 132, 1)',
                  'rgba(255, 99, 132, 1)',
                  'rgba(255, 99, 132, 1)',
                  'rgba(255, 99, 132, 1)',
                  'rgba(255, 99, 132, 1)',
                  'rgba(255, 99, 132, 1)',
              ],
              borderWidth: 1
          }]
          }

        });
      },
      () => {
        this.loader.loadingCompanyRating = false;
        this.notificationError('Calificación de comentarios');

      }
    );
  }
  /**
   * @author Juan Antonio Guevara Flores
   * @description Obtiene las estadisticias de requerimientos de compra
   * @param filters
   */
  private getRequests(filters: StatisticsFilterInterface) {
    this.loader.loadingTotalRequests = true;
    this.business.estadisticaSolicitudesNegocio(filters).subscribe(
      async response => {
        this.requests = await response.data.solicitudes;
        this.statistics.totalRequests = response.data.length;
        /*this.statistics.totalRequests = response.data.length;
        this.statistics.requests = response.data;*/
        this.loader.loadingTotalRequests = false;
        //console.log("Estadisticas por REQUERIMIENTOS: "+JSON.stringify(response))
        var vistaTipos = response.data.datos
        var labels=[]
        var data = []
        var tags = []
        vistaTipos.forEach(tipo => {
            if(filters.tipo == "localidad"){
              labels.push(tipo.solicitud)
              data.push(tipo.total)
              tags.push(tipo.municipio+" "+tipo.estado+": "+tipo.total+" vistas")
            }
            else if(filters.tipo == "edad"){
              labels.push(tipo.solicitud)
              data.push(tipo.total)
              tags.push(tipo.edad+" "+"años"+": "+tipo.total+" vistas")
            }
            else if(filters.tipo == "genero"){
              labels.push(tipo.genero)
              data.push(tipo.total)
              tags.push(tipo.genero+": "+tipo.total+" vistas")
            }    
        });
        this.dataGraficas.dataReqCompra={
          data:{
            labels: labels,
            datasets: [{
                label: 'Requerimientos de compra',
                data: data,
                backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(255, 159, 64, 0.2)',
                  'rgba(255, 205, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(201, 203, 207, 0.2)'
                ],
                borderColor: [
                  'rgb(255, 99, 132)',
                  'rgb(255, 159, 64)',
                  'rgb(255, 205, 86)',
                  'rgb(75, 192, 192)',
                  'rgb(54, 162, 235)',
                  'rgb(153, 102, 255)',
                  'rgb(201, 203, 207)'
                ],
            }]
          },
          tagsTooltip : tags,
      }
        /*var vistaTipos = response.data.datos
        var labels=[]
        var data = []
        var tags = []
        vistaTipos.forEach(tipo => {
            if(filters.tipo == "localidad"){
              labels.push(tipo.solicitud)
              data.push(tipo.total)
              tags.push(tipo.municipio+" "+tipo.estado+": "+tipo.total+" vistas")
            }
            else if(filters.tipo == "edad"){
              labels.push(tipo.solicitud)
              data.push(tipo.total)
              tags.push(tipo.edad+" "+"años"+": "+tipo.total+" vistas")
            }
            else if(filters.tipo == "genero"){
              labels.push(tipo.solicitud)
              data.push(tipo.total)
              tags.push(tipo.genero+": "+tipo.total+" vistas")
            }    
        });
        this.requestsData={
          data:{
            labels: labels,
            datasets: [{
                label: 'Buena',
                data: data,
                backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(255, 159, 64, 0.2)',
                  'rgba(255, 205, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(201, 203, 207, 0.2)'
                ],
                borderColor: [
                  'rgb(255, 99, 132)',
                  'rgb(255, 159, 64)',
                  'rgb(255, 205, 86)',
                  'rgb(75, 192, 192)',
                  'rgb(54, 162, 235)',
                  'rgb(153, 102, 255)',
                  'rgb(201, 203, 207)'
                ],
            }]
          },
          tagsTooltip : tags,
      }*/
      },
      () => {
        this.loader.loadingTotalRequests = true;
        this.notificationError('Requerimientos de compra');
      }
    );
  }
  /**
   * @author Juan Antonio Guevara Flores
   * @description Obtiene las promociones y el total
   * @param filters
   */
  private getPromotions(filters: StatisticsFilterInterface) {
    this.loader.loadingTotalPromotions = true;
    this.business.estadisticaPromocionesNegocio(filters).subscribe(
      async response => {
        /*this.statistics.totalPromotions = response.data.length;
        this.statistics.promotions = response.data;*/
        if(response.code == 200){
          this.promotions = await response.data.lenght != 0? response.data.promociones : []
        }else{
          this.promotions = []
        }
        this.loader.loadingTotalPromotions = false;
        //console.log("Etsadisticas por PROMOCIONES: "+JSON.stringify(response))
        var vistaTipos = response.data.datos
        var labels=[]
        var data = []
        var tags = []
        vistaTipos.forEach(tipo => {
            if(filters.tipo == "localidad"){
              labels.push(tipo.promocion)
              data.push(tipo.total)
              tags.push(tipo.municipio+" "+tipo.estado+": "+tipo.total+" vistas")
            }
            else if(filters.tipo == "edad"){
              labels.push(tipo.promocion)
              data.push(tipo.total)
              tags.push(tipo.edad+" "+"años"+": "+tipo.total+" vistas")
            }
            else if(filters.tipo == "genero"){
              labels.push(tipo.promocion)
              data.push(tipo.total)
              tags.push(tipo.genero+": "+tipo.total+" vistas")
            }    
        });
        this.dataGraficas.dataPromociones={
          data:{
            labels: labels,
            datasets: [{
                label: 'Promociones',
                data: data,
                backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(255, 159, 64, 0.2)',
                  'rgba(255, 205, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(201, 203, 207, 0.2)'
                ],
                borderColor: [
                  'rgb(255, 99, 132)',
                  'rgb(255, 159, 64)',
                  'rgb(255, 205, 86)',
                  'rgb(75, 192, 192)',
                  'rgb(54, 162, 235)',
                  'rgb(153, 102, 255)',
                  'rgb(201, 203, 207)'
                ],
            }]
          },
          tagsTooltip : tags,
      }
        /*var vistaTipos = response.data.datos
        var labels=[]
        var data = []
        var tags = []
        vistaTipos.forEach(tipo => {
            if(filters.tipo == "localidad"){
              labels.push(tipo.promocion)
              data.push(tipo.total)
              tags.push(tipo.municipio+" "+tipo.estado+": "+tipo.total+" vistas")
            }
            else if(filters.tipo == "edad"){
              labels.push(tipo.promocion)
              data.push(tipo.total)
              tags.push(tipo.edad+" "+"años"+": "+tipo.total+" vistas")
            }
            else if(filters.tipo == "genero"){
              labels.push(tipo.promocion)
              data.push(tipo.total)
              tags.push(tipo.genero+": "+tipo.total+" vistas")
            }    
        });
        this.promotionsData={
          data:{
            labels: labels,
            datasets: [{
                label: 'Promociones',
                data: data,
                backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(255, 159, 64, 0.2)',
                  'rgba(255, 205, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(201, 203, 207, 0.2)'
                ],
                borderColor: [
                  'rgb(255, 99, 132)',
                  'rgb(255, 159, 64)',
                  'rgb(255, 205, 86)',
                  'rgb(75, 192, 192)',
                  'rgb(54, 162, 235)',
                  'rgb(153, 102, 255)',
                  'rgb(201, 203, 207)'
                ],
            }]
          },
          tagsTooltip : tags,
      }*/
      },
      () => {
        this.notificationError('Promociones');
        this.loader.loadingTotalPromotions = false;
      }
    );
  }
  /**
   * @author Juan Antonio Guevara Flores
   * @description obtiene los productos y sus likes
   * @param filters
   */
  private getLikesProducts(filters: StatisticsFilterInterface) {
    this.loader.loadingLikesProducts = true;
    this.business.estadisticaVistasProductosNegocio(filters).subscribe(
      response => {
        //var totalLikes=0;
        response.data.productos.forEach(producto => {
          this.statistics.totalLikesProducts += producto.numero_likes
        });
        
        console.log("Total de likes de productosxxxx: "+this.statistics.totalLikesProducts)
        /*this.statistics.totalLikesProducts = response.data.length;
        this.statistics.products = response.data;*/
        this.products = response.data;
        this.loader.loadingLikesProducts = false;
        console.log("Estadisticas por likes PRODUCTOS: "+JSON.stringify(response))
        var vistaTipos = response.data.datos
        var labels=[]
        var data = []
        var tags = []
        vistaTipos.forEach(tipo => {
            if(filters.tipo == "localidad"){
              labels.push(tipo.producto)
              data.push(tipo.total)
              tags.push(tipo.municipio+" "+tipo.estado+": "+tipo.total+" Likes")
            }
            else if(filters.tipo == "edad"){
              labels.push(tipo.producto)
              data.push(tipo.total)
              tags.push(tipo.edad+" "+"años"+": "+tipo.total+" Likes")
            }
            else if(filters.tipo == "genero"){
              labels.push(tipo.producto)
              data.push(tipo.total)
              tags.push(tipo.genero+": "+tipo.total+" Likes")
            }    
        });
        this.dataGraficas.dataLikesProducts={
          data:{
            labels: labels,
            datasets: [{
                label: 'Likes de productos',
                data: data,
                backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(255, 159, 64, 0.2)',
                  'rgba(255, 205, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(201, 203, 207, 0.2)'
                ],
                borderColor: [
                  'rgb(255, 99, 132)',
                  'rgb(255, 159, 64)',
                  'rgb(255, 205, 86)',
                  'rgb(75, 192, 192)',
                  'rgb(54, 162, 235)',
                  'rgb(153, 102, 255)',
                  'rgb(201, 203, 207)'
                ],
            }]
          },
          tagsTooltip : tags,
      }
        /*var vistaTipos = response.data.datos
        var labels=[]
        var data = []
        var tags = []
        vistaTipos.forEach(tipo => {
          
            if(filters.tipo == "localidad"){
              labels.push(tipo.id_producto)
              data.push(tipo.total)
              tags.push(tipo.municipio+" "+tipo.estado+": "+tipo.total+" Likes")
            }
            else if(filters.tipo == "edad"){
              labels.push(tipo.id_producto)
              data.push(tipo.total)
              tags.push(tipo.edad+" "+"años"+": "+tipo.total+" Likes")
            }
            else if(filters.tipo == "genero"){
              labels.push(tipo.id_producto)
              data.push(tipo.total)
              tags.push(tipo.genero+": "+tipo.total+" Likes")
            }    
        });
        this.likesProductosData={
          data:{
            labels: labels,
            datasets: [{
                label: 'Likes de productos',
                data: data,
                backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(255, 159, 64, 0.2)',
                  'rgba(255, 205, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(201, 203, 207, 0.2)'
                ],
                borderColor: [
                  'rgb(255, 99, 132)',
                  'rgb(255, 159, 64)',
                  'rgb(255, 205, 86)',
                  'rgb(75, 192, 192)',
                  'rgb(54, 162, 235)',
                  'rgb(153, 102, 255)',
                  'rgb(201, 203, 207)'
                ],
            }]
          },
          tagsTooltip : tags,
      }*/
      },
      () => {
        this.notificationError('Likes por producto');
        this.loader.loadingLikesProducts = false;
      }
    );
  }
  /**
   * @author Juan Antonio Guevara Flores
   * @description Valida el loading si se activa
   */
  get loading() {
    return !(this.validator.validateObj(this.loader, new BusinessStatisticsLoaderModel()));

  }
  /**
   * @author Juan Antonio Guevara Flores
   * @description Retorna el total de visitas por qr y url
   */
  get totalVisitsQrAndUrl() {
    return (this.statistics.totalVisitsByQr + this.statistics.totalVisitsByUrl);
  }
  /**
   * @author Juan Antonio Guevara Flores
   * @description Valida y retorna si existen o requerimientos de compra
   */
  get totalRequest() {
    return (this.statistics.totalRequests !== 0);
  }
  /**
   * @author Juan Antonio Guevara Flores
   * @description Valida y retorna si existe total de likes en productos
   */
  get totalProduct() {
    return (this.statistics.totalLikesProducts );
  }

  noSuscriptionMSG(){
    
  }
  async obtenerFeatures(id_negocio: number){
    await this._general_service.features(id_negocio).subscribe(
        response => {
            //console.log("FEATURES del id_negocio: "+id_negocio+",\n"+JSON.stringify(response))
            this.features16 = false;
            if (response.data.lenght != 0){                    
                response.data.forEach(feature => {
                    if(feature.id_caracteristica == 16){   
                      this.features16=true                    
                      //console.log("\nEl negocio tiene el features 16? "+this.features16)
                    }          
                });
            }else{
              //console.log("Features Vacío")  
              
            }
        },
        error => {
            console.log("error"+error)
        }
    );
  }
  /**
   * @author Juan Antonio Guevara Flores
   * @description Retorna un Mensaje de error dependiendo del Servicio
   * @param by
   */
  private notificationError(by: string) {
    this.toadNotificacion.error('No se pudo cargar las estaditicas de ' + by);
  }
  graficaVisitas(tipo:string){//viitasQRData
    this.chartType = "pie";
    this.dataSet=tipo
    this.showToggle=true
    this.tipoEstadistica="Visitas a travéz de "+tipo+" "
    if(this.grafica){
      this.grafica.clear();
    }
    if(this.filter.tipo != null){
      console.log("Tipo"+this.filter.tipo)
      if(tipo == "QR"){
        this.genBarChartDynamic(this.dataGraficas.dataVisistasQR.data,this.dataGraficas.dataVisistasQR.tagsTooltip)
      }else if(tipo == "URL"){
        this.genBarChartDynamic(this.dataGraficas.dataVisitasUrl.data,this.dataGraficas.dataVisitasUrl.tagsTooltip)
      }
      
    }else{
      console.log("No selecciono tipo")
    }
    /*this.showToggle=true
    this.tipoEstadistica="Visitas a travéz de "+tipo+" "
    this.datosGrafica.data = []
    this.datosGrafica.labels=[]
    if(this.filter.tipo != null){
      if(tipo == "QR"){
        console.log("ves grafica de vistas por QR\n"+JSON.stringify(this.visitasQr))

        this.datosGrafica.data = this.visitasQr.data
        this.datosGrafica.labels = this.visitasQr.labels
        this.generarGraficoPastel(this.datosGrafica)
      }else if(tipo == "URL"){
        console.log("ves grafica de vistas por URL")
        this.datosGrafica.data = this.visitasUrl.data
        this.datosGrafica.labels = this.visitasUrl.labels
        this.generarGraficoPastel(this.datosGrafica)
      }
    }else{
      console.log("No selecciono tipo")
    }*/
  }
  graficaLikesNegocio(tipo:string){
    this.chartType = "pie";
    this.dataSet=tipo
    this.showToggle=true
    this.tipoEstadistica="Likes de negocio "
    if(this.grafica){
      this.grafica.clear();
    }
    if(this.filter.tipo != null){
      console.log("Tipo"+this.filter.tipo)
      this.genBarChartDynamic(this.dataGraficas.dataLikesNegocio.data,this.dataGraficas.dataLikesNegocio.tagsTooltip)
    }else{
      console.log("No selecciono tipo")
    }
    /*this.dataSet=tipo
    this.showToggle=true
    this.tipoEstadistica="Likes de negocio"
    this.datosGrafica.data = []
    this.datosGrafica.labels=[]
    if(this.grafica){
      this.grafica.clear();
    }
    if(this.filter.tipo != null){
      //console.log("ves grafica de LIKES NEGOCIO\n"+JSON.stringify(this.visitasQr))
      this.datosGrafica.data = this.likesNegocio.data
      this.datosGrafica.labels = this.likesNegocio.labels
      this.generarGraficoPastel(this.datosGrafica)
    }else{
      console.log("No selecciono tipo")
    }*/
  }
  graficaRating(){
    this.showToggle=false
    this.tipoEstadistica="Calificaciones del negocio"
    if(this.grafica){
      this.grafica.clear();
    }
    if(this.filter.tipo != null){
      this.genBarChartDynamic(this.ratingData)
    }else{
      console.log("No selecciono tipo")
    }
  }
  graficaRequerimientos(tipo:string){
    this.chartType = "pie";
    this.dataSet=tipo
    this.showToggle=true
    this.tipoEstadistica="Visitas de requerimientos "
    if(this.grafica){
      this.grafica.clear();
    }
    if(this.filter.tipo != null){
      console.log("Tipo"+this.filter.tipo)
      this.genBarChartDynamic(this.dataGraficas.dataReqCompra.data,this.dataGraficas.dataReqCompra.tagsTooltip)
    }else{
      console.log("No selecciono tipo")
    }
    /*this.showToggle=false
    this.tipoEstadistica="Vistas de requerimientos "
    if(this.grafica){
      this.grafica.clear();
    }
    if(this.filter.tipo != null){
      this.genBarChartDynamic(this.requestsData.data,this.requestsData.tagsTooltip)
    }else{
      console.log("No selecciono tipo")
    }*/
  }
  graficaPromos(tipo:string){
    this.chartType = "pie";
    this.dataSet=tipo
    this.showToggle=true
    this.tipoEstadistica="Visitas de promociónes "
    if(this.grafica){
      this.grafica.clear();
    }
    if(this.filter.tipo != null){
      console.log("Tipo"+this.filter.tipo)
      this.genBarChartDynamic(this.dataGraficas.dataPromociones.data,this.dataGraficas.dataPromociones.tagsTooltip)
    }else{
      console.log("No selecciono tipo")
    }
    /*this.showToggle=false
    this.tipoEstadistica="Vistas de promociónes "
    if(this.grafica){
      this.grafica.clear();
    }
    if(this.filter.tipo != null){
      this.genBarChartDynamic(this.promotionsData.data,this.promotionsData.tagsTooltip)
    }else{
      console.log("No selecciono tipo")
    }*/
  }
  graficaLikesProducts(tipo:string){
    this.chartType = "pie";
    this.dataSet=tipo
    this.showToggle=true
    this.tipoEstadistica="Likes de productos "
    if(this.grafica){
      this.grafica.clear();
    }
    if(this.filter.tipo != null){
      console.log("Tipo"+this.filter.tipo)
      this.genBarChartDynamic(this.dataGraficas.dataLikesProducts.data,this.dataGraficas.dataLikesProducts.tagsTooltip)
    }else{
      console.log("No selecciono tipo")
    }
    /*if(this.statistics.totalLikesProducts>0){
      this.showToggle=true
      this.tipoEstadistica="Likes de productos "
      if(this.grafica){
        this.grafica.clear();
      }
      if(this.filter.tipo != null){
        this.genBarChartDynamic(this.likesProductosData.data)
      }else{
        console.log("No selecciono tipo")
      }
    }*/
  }
    
}
