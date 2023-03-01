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
  public filter: StatisticsFilterInterface
  features16: boolean;
  vistaTipos: any[] = [];
  requests: any[] = [];
  promotions: any[] = [];
  products: any[];
  private grafica :Chart;
  canvas : any
  datosGrafica = {
    labels:[],
    data:[]
  };
  chartType = "pie";

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
  }

  ratingData:any;

  tipoEstadistica: string =null;
  showToggle: boolean;
  showToggleRating: boolean;
  dataSet: string;
  
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

  }
  /*generarGraficoBarras(datos:any){
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
  }*/
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
  genDoughnutChartDynamic(data:any,tooltipTags?:any[]){
    console.log("genDoughnutChartDynamic")
    if(this.grafica){
      this.grafica.clear();
      this.grafica.destroy();
    }
    const canvas = document.getElementById('myChart');
    const ctx = (canvas as HTMLCanvasElement).getContext('2d');
    this.grafica = new Chart(ctx, {
      type: 'line',
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
  /*generarGraficoPastel(datos:any){
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
  }*/
  toggleGrafica(){
    if(this.dataSet=="URL"){
      if(this.chartType == "bar"){
        this.chartType = "pie"
        this.genBarChartDynamic(this.dataGraficas.dataVisitasUrl.data,this.dataGraficas.dataVisitasUrl.tagsTooltip)
      }else if(this.chartType == "pie"){
        this.chartType = "bar"
       this. genPieChartDynamic(this.dataGraficas.dataVisitasUrl.data,this.dataGraficas.dataVisitasUrl.tagsTooltip)
      }
    }
    if(this.dataSet=="QR"){
      if(this.chartType == "bar"){
        this.chartType = "pie"
        this.genBarChartDynamic(this.dataGraficas.dataVisistasQR.data,this.dataGraficas.dataVisistasQR.tagsTooltip)
      }else if(this.chartType == "pie"){
        this.chartType = "bar"
       this. genPieChartDynamic(this.dataGraficas.dataVisistasQR.data,this.dataGraficas.dataVisistasQR.tagsTooltip)
      }
    }
    if(this.dataSet=="likesNegocio"){
      if(this.chartType == "bar"){
        this.chartType = "pie"
        this.genBarChartDynamic(this.dataGraficas.dataLikesNegocio.data,this.dataGraficas.dataLikesNegocio.tagsTooltip)
      }else if(this.chartType == "pie"){
        this.chartType = "bar"
       this. genPieChartDynamic(this.dataGraficas.dataLikesNegocio.data,this.dataGraficas.dataLikesNegocio.tagsTooltip)
      }
    }
    if(this.dataSet=="requerimientos"){
      if(this.chartType == "bar"){
        this.chartType = "pie"
        this.genBarChartDynamic(this.dataGraficas.dataReqCompra.data,this.dataGraficas.dataReqCompra.tagsTooltip)
      }else if(this.chartType == "pie"){
        this.chartType = "bar"
       this. genPieChartDynamic(this.dataGraficas.dataReqCompra.data,this.dataGraficas.dataReqCompra.tagsTooltip)
      }
    }
    if(this.dataSet=="promociones"){
      if(this.chartType == "bar"){
        this.chartType = "pie"
        this.genBarChartDynamic(this.dataGraficas.dataPromociones.data,this.dataGraficas.dataPromociones.tagsTooltip)
      }else if(this.chartType == "pie"){
        this.chartType = "bar"
       this. genPieChartDynamic(this.dataGraficas.dataPromociones.data,this.dataGraficas.dataPromociones.tagsTooltip)
      }
    }
    if(this.dataSet=="likesProductos"){
      if(this.chartType == "bar"){
        this.chartType = "pie"
        this.genBarChartDynamic(this.dataGraficas.dataLikesProducts.data,this.dataGraficas.dataLikesProducts.tagsTooltip)
      }else if(this.chartType == "pie"){
        this.chartType = "bar"
       this. genPieChartDynamic(this.dataGraficas.dataLikesProducts.data,this.dataGraficas.dataLikesProducts.tagsTooltip)
      }
    }
    if(this.dataSet=="rating"){
      if(this.chartType == "bar"){
        this.chartType = "line"
        this.genDoughnutChartDynamic(this.ratingData)        
      }else if(this.chartType == "line"){
        this.chartType = "bar"
        this.genBarChartDynamic(this.ratingData)
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
    this.business.estadisticaVisitasQR(filters).subscribe(
      response => {
        if(response.code == 200){
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
        }else{this.loader.loadingVisitsByQr = false;}             
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
    await this.business.estadisticaVisitasURL(filters).subscribe(
      response => {
        if(response.code == 200){
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
       } else{this.loader.loadingVisitsByUrl = false;}        


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
    this.business.estadisticaLikesNegocio(filters).subscribe(
      response => {
        if(response.code == 200){
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
        }else{this.loader.loadingLikesBusiness = false;}    
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
        if(response.code == 200){
          if (this.create.anyToNumber(response.data.total_califaciones) !== 0) {
            this.statistics.goodGrade = this.create.anyToNumber(response.data.calificacion_buena);
            this.statistics.averageRating = this.create.anyToNumber(response.data.calificacion_media);
            this.statistics.lowRating = this.create.anyToNumber(response.data.calificacion_baja);
          }
          this.loader.loadingCompanyRating = false;
          console.log("Estadisticas por RATING: "+JSON.stringify(response))
          
          var vistaTipos = response.data.datos
          /*[
            {
              genero: "Mujer",
              edad: 31,
              municipio: "Apizaco",
              estado: "Tlaxcala",
              calificacion: 5,
              total: 1
            },
            {
              genero: "Hombre",
              edad: 23,
              municipio: "Lázaro Cárdenas",
              estado: "Tlaxcala",
              calificacion: 5,
              total: 2
            },
            {
              genero: "Hombre",
              edad: 50,
              municipio: "Xalostoc",
              estado: "Tlaxcala",
              calificacion: 3,
              total: 3
            },
            {
              genero: "Mujer",
              edad: 25,
              municipio: "Huamantla",
              estado: "Tlaxcala",
              calificacion: 4,
              total: 1
            },
            {
              genero: "Hombre",
              edad: 25,
              municipio: "Zapata",
              estado: "Tlaxcala",
              calificacion: 2,
              total: 1
            },
            {
              genero: "Mujer",
              edad: 35,
              municipio: "Cárdenas",
              estado: "Tlaxcala",
              calificacion: 1,
              total: 1
            }
          ]*/
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
                    fill:false,
                    borderColor:'rgb(75, 192, 192)',
                    tension: 0.1,
                    backgroundColor: [
                      'rgba(75, 192, 192, 0.2)',
                      'rgba(75, 192, 192, 0.2)',
                      'rgba(75, 192, 192, 0.2)',
                      'rgba(75, 192, 192, 0.2)',
                      'rgba(75, 192, 192, 0.2)',
                      'rgba(75, 192, 192, 0.2)',
                  ],
                  /*borderColor: [
                      'rgba(75, 192, 192, 1)',
                      'rgba(75, 192, 192, 1)',
                      'rgba(75, 192, 192, 1)',
                      'rgba(75, 192, 192, 1)',
                      'rgba(75, 192, 192, 1)',
                      'rgba(75, 192, 192, 1)',
                  ],
                  borderWidth:1*/
                },
                {
                  label: 'Media',
                  data: medias,
                  fill:false,
                  borderColor:'rgb(255, 206, 86)',
                  tension: 0.1,
                    backgroundColor: [
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                  ],
                  /*borderColor: [
                    'rgba(255, 206, 86, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(255, 206, 86, 1)',
                  ],
                  borderWidth: 1*/
              },
              {
                label: 'Baja',
                data: bajas,
                fill:false,
                borderColor:'rgb(255, 99, 132)',
                tension: 0.1,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(255, 99, 132, 0.2)',
                ],
                /*borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(255, 99, 132, 1)',
                ],
                borderWidth: 1*/
            }]
            }
  
          }); 
        }else{this.loader.loadingCompanyRating = false;}       
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
        if(response.code == 200){          
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
                labels.push(tipo.genero)//solicitud
                data.push(tipo.total)
                tags.push(tipo.solicitud+": "+tipo.total+" vistas")
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
        }else{
          this.loader.loadingTotalRequests = true;
        }     
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
                labels.push(tipo.genero)
                data.push(tipo.total)
                tags.push(tipo.promocion+": "+tipo.total+" vistas")
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
        }else{
          this.loader.loadingTotalPromotions = false;
          this.promotions = []
        }               
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
        if(response.code==200){
          this.statistics.totalLikesProducts=0
          response.data.productos.forEach(producto => {
            this.statistics.totalLikesProducts += producto.numero_likes
          });      
          //this.statistics.totalLikesProducts = response.data.length;
          //this.statistics.products = response.data;
          this.products = response.data;
          this.loader.loadingLikesProducts = false;
          //console.log("Estadisticas por likes PRODUCTOS: "+JSON.stringify(response))
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
        }else{
          console.log("Algo ocurrió: "+JSON.stringify(response))
          this.loader.loadingLikesProducts = false;
        }              
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
  graficaVisitas(tipo:string){
    this.chartType = "pie";
    this.dataSet=tipo
    this.showToggle=true
    this.showToggleRating = false
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
  }
  graficaLikesNegocio(tipo:string){
    this.chartType = "pie";
    this.dataSet=tipo
    this.showToggle=true
    this.showToggleRating = false
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
  }
  graficaRating(tipo:string){
    this.showToggle = false
    this.showToggleRating = true
    this.chartType = "bar";
    this.dataSet=tipo
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
    this.showToggleRating = false
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
  }
  graficaPromos(tipo:string){
    this.chartType = "pie";
    this.dataSet=tipo
    this.showToggle=true
    this.showToggleRating = false
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
  }
  graficaLikesProducts(tipo:string){
    this.chartType = "pie";
    this.dataSet=tipo
    this.showToggle=true
    this.showToggleRating = false
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
  }
    
}
