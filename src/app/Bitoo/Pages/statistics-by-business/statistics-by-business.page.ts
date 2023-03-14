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
      tagsTooltip:[],
      tagsToolTipPie:[]
    },
    dataVisitasUrl:{
      data:{},
      tagsTooltip:[],
      tagsToolTipPie:[]
    },
    dataLikesNegocio:{
      data:{},
      tagsTooltip:[],
      tagsToolTipPie:[]
    },
    dataReqCompra:{
      data:{},
      tagsTooltip:[],
      tagsToolTipPie:[]
    },
    dataPromociones:{
      data:{},
      tagsTooltip:[],
      tagsToolTipPie:[]
    },
    dataLikesProducts:{
      data:{},
      tagsTooltip:[],
      tagsToolTipPie:[]
    },
    dataSocialInteractions:{
      data:{},
      tagsTooltip:[],
      tagsToolTipPie:[]
    },
    dataCompras:{
      data:{},
      tagsTooltip:[],
      tagsToolTipPie:[]
    },
    dataMapInteractions:{
      data:{},
      tagsTooltip:[],
      tagsToolTipPie:[]
    },
  }

  //ratingData:any;
  ratingData:{
    data:{},
    tagsTooltip: any[],
    tagsToolTipPie: any[]
  }
  tipoEstadistica: string =null;
  showToggle: boolean;
  showToggleRating: boolean;
  dataSet: string;
  numeroCompras: number=0;
  interaccionesRedes: number =0;
  interaccionesMapa: number;
  
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
  
  toggleGrafica(){
    if(this.dataSet=="URL"){
      if(this.chartType == "bar"){
        this.chartType = "pie"
        this.genBarChartDynamic(this.dataGraficas.dataVisitasUrl.data,this.dataGraficas.dataVisitasUrl.tagsTooltip)
      }else if(this.chartType == "pie"){
        this.chartType = "bar"
       this. genPieChartDynamic(this.dataGraficas.dataVisitasUrl.data,this.dataGraficas.dataVisitasUrl.tagsToolTipPie)
      }
    }
    if(this.dataSet=="QR"){
      if(this.chartType == "bar"){
        this.chartType = "pie"
        this.genBarChartDynamic(this.dataGraficas.dataVisistasQR.data,this.dataGraficas.dataVisistasQR.tagsTooltip)
      }else if(this.chartType == "pie"){
        this.chartType = "bar"
       this. genPieChartDynamic(this.dataGraficas.dataVisistasQR.data,this.dataGraficas.dataVisistasQR.tagsToolTipPie)
      }
    }
    if(this.dataSet=="likesNegocio"){
      if(this.chartType == "bar"){
        this.chartType = "pie"
        this.genBarChartDynamic(this.dataGraficas.dataLikesNegocio.data,this.dataGraficas.dataLikesNegocio.tagsTooltip)
      }else if(this.chartType == "pie"){
        this.chartType = "bar"
       this. genPieChartDynamic(this.dataGraficas.dataLikesNegocio.data,this.dataGraficas.dataLikesNegocio.tagsToolTipPie)
      }
    }
    if(this.dataSet=="requerimientos"){
      if(this.chartType == "bar"){
        this.chartType = "pie"
        this.genBarChartDynamic(this.dataGraficas.dataReqCompra.data,this.dataGraficas.dataReqCompra.tagsTooltip)
      }else if(this.chartType == "pie"){
        this.chartType = "bar"
       this. genPieChartDynamic(this.dataGraficas.dataReqCompra.data,this.dataGraficas.dataReqCompra.tagsToolTipPie)
      }
    }
    if(this.dataSet=="promociones"){
      if(this.chartType == "bar"){
        this.chartType = "pie"
        this.genBarChartDynamic(this.dataGraficas.dataPromociones.data,this.dataGraficas.dataPromociones.tagsTooltip)
      }else if(this.chartType == "pie"){
        this.chartType = "bar"
       this. genPieChartDynamic(this.dataGraficas.dataPromociones.data,this.dataGraficas.dataPromociones.tagsToolTipPie)
      }
    }
    if(this.dataSet=="likesProductos"){
      if(this.chartType == "bar"){
        this.chartType = "pie"
        this.genBarChartDynamic(this.dataGraficas.dataLikesProducts.data,this.dataGraficas.dataLikesProducts.tagsTooltip)
      }else if(this.chartType == "pie"){
        this.chartType = "bar"
       this. genPieChartDynamic(this.dataGraficas.dataLikesProducts.data,this.dataGraficas.dataLikesProducts.tagsToolTipPie)
      }
    }
    if(this.dataSet=="rating"){
      if(this.chartType == "bar"){
        this.chartType = "pie"
        this.filter.tipo != null? this.genBarChartDynamic(this.ratingData.data,this.ratingData.tagsTooltip) : this.genBarChartDynamic(this.ratingData.data)
      }else if(this.chartType == "pie"){
        this.chartType = "bar"
        this.filter.tipo != null? this.genPieChartDynamic(this.ratingData.data,this.ratingData.tagsToolTipPie) : this.genPieChartDynamic(this.ratingData.data)
      }
    }
    if(this.dataSet=="redes"){
      if(this.chartType == "bar"){
        this.chartType = "pie"
        this.filter.tipo != null? this.genBarChartDynamic(this.dataGraficas.dataSocialInteractions.data,this.dataGraficas.dataSocialInteractions.tagsTooltip) : this.genBarChartDynamic(this.dataGraficas.dataSocialInteractions.data,this.dataGraficas.dataSocialInteractions.tagsTooltip)
      }else if(this.chartType == "pie"){
        this.chartType = "bar"
        this.genPieChartDynamic(this.dataGraficas.dataSocialInteractions.data,this.dataGraficas.dataSocialInteractions.tagsToolTipPie)
      }
    }
    if(this.dataSet=="compras"){
      if(this.chartType == "bar"){
        this.chartType = "pie"
        this.filter.tipo != null? this.genBarChartDynamic(this.dataGraficas.dataCompras.data,this.dataGraficas.dataCompras.tagsTooltip) : this.genBarChartDynamic(this.dataGraficas.dataCompras.data,this.dataGraficas.dataCompras.tagsTooltip)
      }else if(this.chartType == "pie"){
        this.chartType = "bar"
        this.genPieChartDynamic(this.dataGraficas.dataCompras.data,this.dataGraficas.dataCompras.tagsToolTipPie)
      }
    }
    if(this.dataSet=="interactionsMapa"){
      if(this.chartType == "bar"){
        this.chartType = "pie"
        this.filter.tipo != null? this.genBarChartDynamic(this.dataGraficas.dataMapInteractions.data,this.dataGraficas.dataMapInteractions.tagsTooltip) : this.genBarChartDynamic(this.dataGraficas.dataMapInteractions.data,this.dataGraficas.dataMapInteractions.tagsTooltip)
      }else if(this.chartType == "pie"){
        this.chartType = "bar"
        this.genPieChartDynamic(this.dataGraficas.dataMapInteractions.data,this.dataGraficas.dataMapInteractions.tagsToolTipPie)
      }
    }
  }
  generarNumero(numero){
    return (Math.random()*numero).toFixed(0);
  }
  
  backgroundColorGenerator(){

    var coolor = "rgba("+this.generarNumero(255)+"," + this.generarNumero(255) + "," + this.generarNumero(255) +",0.5"+")"
    
    return coolor;
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
    this.getVisitsByQr(filter);//ok
    this.getVisitsByUrl(filter);//ok
    this.getLikesBusiness(filter);//ok
    this.getCompanyRating(filter);//ok
    this.getRequests(filter);//ok
    this.getPromotions(filter);//ok
    this.getLikesProducts(filter);//ok
    this.getNumeroInteracciones(filter)
    this.getNumeroInteraccionesMapa(filter)
    this.getNumeroCompras(filter)
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
          var labels=[]
          var data = []
          var tags = []
          var tagsPie = []
          if(this.filter.tipo != null){
            var vistaTipos = response.data.datos
            vistaTipos.forEach(tipo => {
                if(filters.tipo == "localidad"){
                  labels.push(tipo.municipio+" "+tipo.estado)
                  data.push(tipo.total)
                  tags.push("Visitas: "+tipo.total)
                  tagsPie.push(tipo.municipio+" "+tipo.estado+": "+tipo.total+" visitas")
                }
                else if(filters.tipo == "edad"){
                  labels.push(tipo.edad + " años")
                  data.push(tipo.total)
                  tags.push("Visitas: "+tipo.total)
                  tagsPie.push(tipo.edad+": "+tipo.total+" visitas")
                }
                else if(filters.tipo == "genero"){
                  labels.push(tipo.genero)
                  data.push(tipo.total)
                  tags.push("Visitas: "+tipo.total)
                  tagsPie.push(tipo.genero+": "+tipo.total+" visitas")
                }    
            });
            var backgrounds = []
            var borders = []
            labels.forEach(() => {
              var color = this.backgroundColorGenerator()
              backgrounds.push(color);
              borders.push(color)
            });
            this.dataGraficas.dataVisistasQR={
              data:{
                labels: labels,
                datasets: [{
                    label: 'Visitas por QR',
                    data: data,
                    backgroundColor: backgrounds,
                    borderColor: borders,
                    borderWidth: 1
                }]
              },
              tagsTooltip : tags,
              tagsToolTipPie: tagsPie
            }
          }else{
            var vistaTipos = response.data.numero_visto
            labels.push("Visitas")
            data.push(vistaTipos)
            tags.push(vistaTipos+" visitas")
            tagsPie.push(vistaTipos+" visitas")
            var backgrounds = []
            var borders = []
            labels.forEach(() => {
              var color = this.backgroundColorGenerator()
              backgrounds.push(color);
              borders.push(color)
            });
            this.dataGraficas.dataVisistasQR={
              data:{
                labels: labels,
                datasets: [{
                    label: 'Visitas por QR',
                    data: data,
                    backgroundColor: backgrounds,
                    borderColor: borders,
                    borderWidth: 1
                }]
              },
              tagsTooltip : tags,
              tagsToolTipPie : tagsPie
            }
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
        var labels=[]
        var data = []
        var tags = []
        var tagsPie = []
        if(this.filter.tipo != null){
          var vistaTipos = response.data.datos
          vistaTipos.forEach(tipo => {
              if(filters.tipo == "localidad"){
                labels.push(tipo.municipio+" "+tipo.estado)
                data.push(tipo.total)
                tags.push("Visitas: "+tipo.total)
                tagsPie.push(tipo.municipio+" "+tipo.estado+": "+tipo.total+" visitas")
              }
              else if(filters.tipo == "edad"){
                labels.push(tipo.edad + " años")
                data.push(tipo.total)
                tags.push("Visitas: "+tipo.total)
                tagsPie.push(tipo.edad+" años - "+tipo.total+" visitas")
              }
              else if(filters.tipo == "genero"){
                labels.push(tipo.genero)
                data.push(tipo.total)
                tags.push("Visitas: "+tipo.total)
                tagsPie.push(tipo.genero+": "+tipo.total+" visitas")
              }    
          });
          var backgrounds = []
          var borders = []
          labels.forEach(() => {
            var color = this.backgroundColorGenerator()
            backgrounds.push(color);
            borders.push(color)
          });
          this.dataGraficas.dataVisitasUrl={
            data:{
              labels: labels,
              datasets: [{
                  label: 'Visitas por URL',
                  data: data,
                  backgroundColor: backgrounds,
                  borderColor: borders,
                  borderWidth: 1
              }]
            },
            tagsTooltip : tags,
            tagsToolTipPie : tagsPie
          }
        }else{
          var vistaTipos = response.data.numero_visto
          labels.push("Visitas")
          data.push(vistaTipos)
          tags.push(vistaTipos+" visitas")
          tagsPie.push(vistaTipos+" visitas")
          var backgrounds = []
          var borders = []
          labels.forEach(() => {
            var color = this.backgroundColorGenerator()
            backgrounds.push(color);
            borders.push(color)
          });
          this.dataGraficas.dataVisitasUrl={
            data:{
              labels: labels,
              datasets: [{
                  label: 'Visitas por URL',
                  data: data,
                  backgroundColor: backgrounds,
                  borderColor: borders,
                  borderWidth: 1
              }]
            },
            tagsTooltip : tags,
            tagsToolTipPie : tagsPie
          }
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
          
          var labels=[]
        var data = []
        var tags = []
        var tagsPie = []
        if(this.filter.tipo != null){
          var vistaTipos = response.data.datos
          if(vistaTipos != null){
            vistaTipos.forEach(tipo => {
              if(filters.tipo == "localidad"){
                labels.push(tipo.municipio+" "+tipo.estado)
                data.push(tipo.total)
                tags.push(tipo.total+" Likes")
                tagsPie.push(tipo.municipio+" "+tipo.estado+": "+tipo.total+" Likes")
              }
              else if(filters.tipo == "edad"){
                labels.push(tipo.edad + " años")
                data.push(tipo.total)
                tags.push(tipo.total+" Likes")
                tagsPie.push(tipo.edad + " años"+": "+tipo.total+" Likes")
              }
              else if(filters.tipo == "genero"){
                labels.push(tipo.genero)
                data.push(tipo.total)
                tags.push(tipo.total+" Likes")
                tagsPie.push(tipo.genero+": "+tipo.total+" Likes")
              }    
          });
          }          
          var backgrounds = []
          var borders = []
          labels.forEach(() => {
            var color = this.backgroundColorGenerator()
            backgrounds.push(color);
            borders.push(color)
          });
          this.dataGraficas.dataLikesNegocio={
            data:{
              labels: labels,
              datasets: [{
                  label: 'Likes de negocio',
                  data: data,
                  backgroundColor: backgrounds,
                  borderColor: borders,
              }]
            },
            tagsTooltip : tags,
            tagsToolTipPie : tagsPie
          }         
        }else{
          var vistaTipos = response.data.numero_likes
          labels.push("Likes")
          data.push(vistaTipos)
          tags.push(vistaTipos+" likes")
          tagsPie.push(vistaTipos+" likes")
          var backgrounds = []
          var borders = []
          labels.forEach(() => {
            var color = this.backgroundColorGenerator()
            backgrounds.push(color);
            borders.push(color)
          });
          this.dataGraficas.dataLikesNegocio={
            data:{
              labels: labels,
              datasets: [{
                  label: 'Likes del negocio',
                  data: data,
                  backgroundColor: backgrounds,
                  borderColor: borders,
                  borderWidth: 1
              }]
            },
            tagsTooltip : tags,
            tagsToolTipPie : tagsPie
          }
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
          //console.log("Estadisticas por CALIFICACIONES: "+JSON.stringify(response))

          var totales=[]
          var labels=[]
          var objeto={}
          var data = []
          if(this.filter.tipo != null){
            var vistaTipos = response.data.datos
            /*vistaTipos =[
                {
                  "estado": "Tlaxcala",
                  "municipio": "Xaloztoc",
                  "edad": "18 - 22 Años",
                  "genero": "Hombre",
                  "calificacion": "Buena",
                  "total": 1
                },
                {
                  "estado": "Tlaxcala",
                  "municipio": "Apizaco",
                  "edad": "23 - 26 Años",
                  "genero": "Hombre",
                  "calificacion": "Media",
                  "total": 1
                },
                {
                  "estado": "Tlaxcala",
                  "municipio": "San cosme",
                  "edad": "27 - 30 Años",
                  "genero": "Hombre",
                  "calificacion": "Baja",
                  "total": 1
                },
                {
                  "estado": "Tlaxcala",
                  "municipio": "Nativitas",
                  "edad": "31 - 34 Años",
                  "genero": "Mujer",
                  "calificacion": "Buena",
                  "total": 1
                },
                {
                  "estado": "Tlaxcala",
                  "municipio": "Sanctorum",
                  "edad": "39 Años o más",
                  "genero": "Mujer",
                  "calificacion": "Media",
                  "total": 1
                },
                {
                  "estado": "Tlaxcala",
                  "municipio": "Tlaxcala",
                  "edad": "18 - 22 Años",
                  "genero": "Mujer",
                  "calificacion": "Baja",
                  "total": 1
                }
            ]*/
            if(this.filter.tipo != "edad" && this.filter.tipo != "localidad"){
            labels.push("Buena")
            labels.push("Media")
            labels.push("Baja")
            }  
        
          //console.log(JSON.stringify(vistaTipos))
            var tags = []
            var tagsPie =[]
            var colors = []
            var buenashombre = 0
            var buenasmujer = 0
            var mediasshombre =0
            var mediasmujer = 0
            var bajashombre = 0
            var bajasmujer = 0
            vistaTipos.forEach(tipo => {
                if(filters.tipo == "localidad"){
                  console.log("eleigio localidad")
                  if(tipo.calificacion=="Baja"){
                    labels.push(tipo.municipio+" - Baja")
                    totales.push(tipo.total)
                    colors.push("rgba(255, 99, 132, 0.2)")
                    tags.push(tipo.total+" Calificaciones bajas")
                    tagsPie.push(tipo.municipio+"("+tipo.estado+"): "+tipo.total+" Calificaciones bajas")
                  }
                  
                  if(tipo.calificacion=="Media"){
                    labels.push(tipo.municipio+" - Media")
                    totales.push(tipo.total)
                    colors.push("rgba(255, 206, 86, 0.2)")
                    tags.push(tipo.total+" Calificaciones medias")
                    tagsPie.push(tipo.municipio+"("+tipo.estado+"): "+tipo.total+" Calificaciones medias")
                  }

                  if(tipo.calificacion=="Buena"){
                    labels.push(tipo.municipio+" - Buena")
                    totales.push(tipo.total)
                    colors.push("rgba(37, 190, 42, 0.2)")
                    tags.push(tipo.total+" Calificaciones buenas")
                    tagsPie.push(tipo.municipio+"("+tipo.estado+"): "+tipo.total+" Calificaciones buenas")
                  }

                  objeto={
                    labels: labels,
                    datasets: [{ 
                        label: 'Calificaciones por '+filters.tipo,
                        data: totales,
                        fill:false,
                        tension: 0.1,
                        backgroundColor: colors,
                        borderWidth:1
                      }]
                  }

                }else if(filters.tipo == "edad"){                  
                  if(tipo.calificacion=="Baja"){
                    labels.push(tipo.edad+" - Calificacion baja")
                    data.push(tipo.total)
                    tagsPie.push(tipo.edad + ": "+tipo.total +" calificacion bajas")
                    tags.push(tipo.total +" calificacion bajas")
                    colors.push("rgba(255, 99, 132, 0.2)")
                  }
                  if(tipo.calificacion=="Media"){
                    labels.push(tipo.edad+" - Calificacion media")
                    data.push(tipo.total)
                    tagsPie.push(tipo.edad + ": "+tipo.total +" calificaciones medias")
                    tags.push(tipo.total +" calificacion medias")
                    colors.push("rgba(255, 206, 86, 0.2)")
                  }
                  if(tipo.calificacion=="Buena"){
                    labels.push(tipo.edad+" - Calificacion buena")
                    data.push(tipo.total)
                    tagsPie.push(tipo.edad + ": "+tipo.total +" calificaciones buenas")
                    tags.push(tipo.total +" calificacion buenas")
                    colors.push("rgba(37, 190, 42, 0.2)")
                  }
                  objeto={
                    labels: labels,
                    datasets: [{ 
                        label: 'Calificaciones por '+filters.tipo,
                        data: data,
                        fill:false,
                        tension: 0.1,
                        backgroundColor: colors,
                        borderWidth:1
                      }]
                  }
                }else if(filters.tipo == "genero"){
                  console.log("eleigio "+filters.tipo)

                  if(tipo.genero == "Hombre"){
                    if(tipo.calificacion=="Baja"){
                      bajashombre=(tipo.total)
                    }
                    if(tipo.calificacion=="Media"){
                      mediasshombre=(tipo.total)
                    }
                    if(tipo.calificacion=="Buena"){
                      console.log("L unica "+tipo.total)
                      buenashombre=(tipo.total)
                    }
                  }
                  console.log("Hombre: "+buenashombre+", "+mediasshombre+", "+bajashombre)
                  if(tipo.genero == "Mujer"){
                    if(tipo.calificacion=="Baja"){
                      bajasmujer=(tipo.total)
                    }
                    if(tipo.calificacion=="Media"){
                      mediasmujer=(tipo.total)
                    }
                    if(tipo.calificacion=="Buena"){
                      buenasmujer=(tipo.total)
                    }
                  }
                  console.log("Mujer: "+bajasmujer+", "+mediasmujer+", "+buenasmujer)
                  
                  objeto={
                    labels: labels,
                    datasets: [
                        {
                        label: 'Hombre',
                        data: [buenashombre,mediasshombre,bajashombre],
                        fill:false,
                        borderColor:['rgba(37, 190, 42)','rgba(255, 206, 86)','rgba(255, 99, 132)'],
                        tension: 0.1,
                        backgroundColor: ['rgba(0, 174, 255, 0.2)','rgba(0, 174, 255, 0.2)','rgba(0, 174, 255, 0.2)'],
                        borderWidth:2
                        },
                        {
                          label: 'Mujer',
                          data: [buenasmujer,mediasmujer,bajasmujer],
                          fill:false,
                          borderColor:['rgba(37, 190, 42)','rgba(255, 206, 86)','rgba(255, 99, 132)'],
                          tension: 0.1,
                          backgroundColor: ['rgba(255, 0, 100, 0.2)','rgba(255, 0, 100, 0.2)','rgba(255, 0, 100, 0.2)'],
                          borderWidth: 2
                        }
                      ]
                    }
                    tags=[
                      buenashombre!=0&&buenasmujer!=0?["Hombre: "+buenashombre,"Mujer: "+buenasmujer]:
                      buenashombre!=0&&buenasmujer<1?"Hombre: "+buenashombre:
                      buenashombre<1&&buenasmujer!=0?"Mujer: "+buenasmujer:"",

                      mediasshombre!=0&&mediasmujer!=0?["Hombre: "+mediasshombre,"Mujer: "+mediasmujer]:
                      mediasshombre!=0&&mediasmujer<1?"Hombre: "+mediasshombre:
                      mediasshombre<1&&mediasmujer!=0?"Mujer: "+mediasmujer:"",
                    
                      bajashombre!=0&&bajasmujer!=0?["Hombre: "+bajashombre,"Mujer: "+bajasmujer]:
                      bajashombre!=0&&bajasmujer<1?"Hombre: "+bajashombre:
                      bajashombre<1&&bajasmujer!=0?"Mujer: "+bajasmujer:"",
                    ]
                    tagsPie=[
                      buenashombre!=0&&buenasmujer!=0?["Hombre: "+buenashombre+" Buenas","Mujer: "+buenasmujer+" Buenas"]:
                      buenashombre!=0&&buenasmujer<1?"Hombre: "+buenashombre+" Buenas":
                      buenashombre<1&&buenasmujer!=0?"Mujer: "+buenasmujer+" Buenas":"",

                      mediasshombre!=0&&mediasmujer!=0?["Hombre: "+mediasshombre+" Medias","Mujer: "+mediasmujer+" Medias"]:
                      mediasshombre!=0&&mediasmujer<1?"Hombre: "+mediasshombre+" Medias":
                      mediasshombre<1&&mediasmujer!=0?"Mujer: "+mediasmujer+" Medias":"",
                    
                      bajashombre!=0&&bajasmujer!=0?["Hombre: "+bajashombre+" Bajas","Mujer: "+bajasmujer+" Bajas"]:
                      bajashombre!=0&&bajasmujer<1?"Hombre: "+bajashombre+" Bajas":
                      bajashombre<1&&bajasmujer!=0?"Mujer: "+bajasmujer+" Bajas":""
                    ]
                } 

              this.ratingData={
                data:objeto,
                tagsTooltip : tags,
                tagsToolTipPie : tagsPie
              }
            }); 
          }
          else{console.log("se llena vacia")
            var labels=[]
            var vistaTipos2 = response.data

            labels.push("Buena")
            labels.push("Media")
            labels.push("Baja")

            this.ratingData={
              data:{
                labels: labels,
                datasets: [{
                label: 'Buena calificación',
                data: [vistaTipos2.calificacion_buena,0,0],
                fill:false,
                borderColor:'rgb(37, 190, 42)',
                tension: 0.1,
                backgroundColor: 'rgba(37, 190, 42, 0.2)',
                borderWidth:1
                },
                {
                  label: 'Media calificación',
                  data: [0,vistaTipos2.calificacion_media,0],
                  fill:false,
                  borderColor:'rgb(255, 206, 86)',
                  tension: 0.1,
                    backgroundColor: "rgba(255, 206, 86, 0.2)",
                  borderWidth: 1
                },
                {
                  label: 'Baja calificación',
                  data: [0,0,vistaTipos2.calificacion_baja],
                  fill:false,
                  borderColor:'rgb(255, 99, 132)',
                  tension: 0.1,
                  backgroundColor: "rgba(255, 99, 132, 0.2)",
                  borderWidth: 1
                }]
              },
            tagsToolTipPie : [],
            tagsTooltip:[]
            }
          }
          
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
          var labels=[]
          var data = []
          var tags = []
          var tagsPie = []
          if(this.filter.tipo != null){
            console.log("se llena con tipo")
            var vistaTipos = response.data.datos            
            vistaTipos.forEach(tipo => {
                if(filters.tipo == "localidad"){
                  labels.push("("+tipo.municipio+") "+tipo.solicitud)
                  data.push(tipo.total)
                  tags.push("Visitas: "+tipo.total)
                  tagsPie.push(tipo.municipio+" ("+tipo.estado+") - "+tipo.solicitud+": "+tipo.total+" visitas")
                }
                else if(filters.tipo == "edad"){
                  labels.push(tipo.solicitud)
                  data.push(tipo.total)
                  tags.push(tipo.edad+" "+"años"+": "+tipo.total+" visitas")
                  tagsPie.push(tipo.edad+" "+"años - "+tipo.solicitud+": "+tipo.total+" visitas")
                }
                else if(filters.tipo == "genero"){
                  labels.push(tipo.genero+" - "+tipo.solicitud)
                  data.push(tipo.total)
                  tags.push("Visitas: "+tipo.total)
                  tagsPie.push(tipo.genero+" - "+tipo.solicitud+": "+tipo.total+" visitas")
                }    
            });
            var backgrounds = []
            var borders = []
            labels.forEach(() => {
              var color = this.backgroundColorGenerator()
              backgrounds.push(color);
              borders.push(color)
            });
            this.dataGraficas.dataReqCompra={
              data:{
                labels: labels,
                datasets: [{
                    label: 'Requerimientos de compra',
                    data: data,
                    backgroundColor: backgrounds,
                    borderColor: borders,
                    borderWidth:1
                }]
              },
              tagsTooltip : tags,
              tagsToolTipPie : tagsPie
            }
          }else{
            console.log("se llena con null")
            var vistaTipos = response.data.solicitudes
            vistaTipos.forEach(tipo => {
                tags.push("Visitas: "+tipo.cuantos_vieron)
                tagsPie.push(tipo.solicitud+": "+tipo.cuantos_vieron+" Visitas")
                labels.push(tipo.solicitud)
                data.push(tipo.cuantos_vieron)                 
            });
            var backgrounds = []
            var borders = []
            labels.forEach(() => {
              var color = this.backgroundColorGenerator()
              backgrounds.push(color);
              borders.push(color)
            });
            this.dataGraficas.dataReqCompra={
              data:{
                labels: labels,
                datasets: [{
                    label: 'Requerimientos de compra',
                    data: data,
                    backgroundColor: backgrounds,
                    borderColor: borders,
                    borderWidth:1
                }]
              },
              tagsTooltip : tags,
              tagsToolTipPie:tagsPie
            }
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
            var labels=[]
            var data = []
            var tags = []
            var tagsPie =[]
            if(this.filter.tipo != null){
              var vistaTipos = response.data.datos          
              vistaTipos.forEach(tipo => {
                if(filters.tipo == "localidad"){
                  labels.push(this.limitarcaracteres(tipo.promocion))
                  data.push(tipo.total)
                  tags.push(tipo.municipio+" "+tipo.estado+": "+tipo.total+" visitas")
                  tagsPie.push(tipo.promocion+": "+tipo.total+" visitas")
                }
                else if(filters.tipo == "edad"){
                  labels.push(this.limitarcaracteres(tipo.promocion))
                  data.push(tipo.total)
                  tags.push(tipo.edad+" "+"años"+": "+tipo.total+" visitas")
                  tagsPie.push(tipo.edad+" "+"años"+": "+tipo.total+" visitas")
                }
                else if(filters.tipo == "genero"){
                  labels.push(tipo.genero+" - "+tipo.promocion)
                  data.push(tipo.total)
                  tags.push("Visitas: "+tipo.total)
                  tagsPie.push(tipo.genero+" - "+this.limitarcaracteres(tipo.promocion)+": "+tipo.total+" visitas")
                }    
              });
              var backgrounds = []
              var borders = []
              labels.forEach(() => {
                var color = this.backgroundColorGenerator()
                backgrounds.push(color);
                borders.push(color)
              });
              this.dataGraficas.dataPromociones={
                data:{
                  labels: labels,
                  datasets: [{
                      label: 'Promociones',
                      data: data,
                      backgroundColor:backgrounds,
                      borderColor: borders,
                      borderWidth:1
                  }]
                },
                tagsTooltip : tags,
                tagsToolTipPie:tagsPie
              }
            }else{
              var vistaTipos = response.data.promociones          
              vistaTipos.forEach(tipo => {
                labels.push(this.limitarcaracteres(tipo.promocion))
                data.push(tipo.numero_vistas)
                tags.push("Visitas: "+tipo.numero_vistas)    
                tagsPie.push(tipo.promocion+": "+tipo.numero_vistas+" visitas")                            
              });
              var backgrounds = []
              var borders = []
              labels.forEach(() => {
                var color = this.backgroundColorGenerator()
                backgrounds.push(color);
                borders.push(color)
              });
              this.dataGraficas.dataPromociones={
                data:{
                  labels: labels,
                  datasets: [{
                      label: 'Promociones',
                      data: data,
                      backgroundColor: backgrounds,
                      borderColor: borders,
                      borderWidth:1
                  }]
                },
                tagsTooltip : tags,
                tagsToolTipPie:tagsPie
              }
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
          var labels=[]
          var data = []
          var tags = []
          var tagsPie = []
          if(this.filter.tipo != null){
            var vistaTipos = response.data.datos            
            vistaTipos.forEach(tipo => {
                if(filters.tipo == "localidad"){
                  labels.push(tipo.producto)
                  data.push(tipo.total)
                  tags.push(tipo.municipio+" "+tipo.estado+": "+tipo.total+" Likes")
                  tagsPie.push(tipo.producto+": "+tipo.total+" Likes")
                }
                else if(filters.tipo == "edad"){
                  labels.push(tipo.producto)
                  data.push(tipo.total)
                  tags.push(tipo.edad+" "+"años"+": "+tipo.total+" Likes")
                  tagsPie.push(tipo.edad+" "+"años"+" - "+tipo.producto+": "+tipo.total+" Likes")
                }
                else if(filters.tipo == "genero"){
                  labels.push(tipo.producto)
                  data.push(tipo.total)
                  tags.push(tipo.genero+": "+tipo.total+" Likes")
                  tagsPie.push(tipo.genero+" - "+tipo.producto+": "+tipo.total+" Likes")
                }    
            });
            var backgrounds = []
            var borders = []
            labels.forEach(() => {
              var color = this.backgroundColorGenerator()
              backgrounds.push(color);
              borders.push(color)
            });
            this.dataGraficas.dataLikesProducts={
              data:{
                labels: labels,
                datasets: [{
                    label: 'Likes de productos',
                    data: data,
                    backgroundColor: backgrounds,
                    borderColor: borders,
                    borderWidth:1
                }]
              },
              tagsTooltip : tags,
              tagsToolTipPie : tagsPie
            }
          }else{
            var vistaTipos = response.data.productos            
            vistaTipos.forEach(tipo => {
              labels.push(tipo.producto)
              data.push(tipo.numero_likes)
              tags.push(tipo.numero_likes+" Likes")    
              tagsPie.push(tipo.producto+": "+tipo.numero_likes+" Likes")                                 
            });
            var backgrounds = []
            var borders = []
            labels.forEach(() => {
              var color = this.backgroundColorGenerator()
              backgrounds.push(color);
              borders.push(color)
            });
            this.dataGraficas.dataLikesProducts={
              data:{
                labels: labels,
                datasets: [{
                    label: 'Likes de productos',
                    data: data,
                    backgroundColor: backgrounds,
                    borderColor: borders,
                    borderWidth:1
                }]
              },
              tagsTooltip : tags,
              tagsToolTipPie : tagsPie
            }
          }
            
        }else{
          console.log("Filtro"+JSON.stringify(this.filter))
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
  private async getNumeroInteracciones(filters: StatisticsFilterInterface){    
    this.loader.loadingVisitsByUrl = true;
    await this.business.numero_interacciones(filters).subscribe(
      response => {
        if(response.code == 200){
          console.log("Estadisticas por Interacciones: "+JSON.stringify(response))
        var labels=[]
        var data = []
        var tags = []
        var tagsPie = []
        this.interaccionesRedes=0
        if(this.filter.tipo != null){
          var vistaTipos = response.data.datos
          /*vistaTipos =[
            {
              opcion:"Facebook",
              edad:19,
              genero:"Hombre",
              municipio:"Apizaco",
              estado:"Tlaxcala",
              total:2            
            },
            {
              opcion:"TikTok",
              edad:15,
              genero:"Hombre",
              municipio:"San Cosme",
              estado:"Tlaxcala",
              total:2
            },
            {
              opcion:"Whatsapp",
              edad:22,
              genero:"Mujer",
              municipio:"Tlaxcala",
              estado:"Tlaxcala",
              total:2
            }
          ]*/
          vistaTipos.forEach(tipo => {
            this.interaccionesRedes+=tipo.total
              if(filters.tipo == "localidad"){
                labels.push(tipo.opcion+"—"+tipo.municipio+" "+tipo.estado)
                data.push(tipo.total)
                tags.push("Interacciones: "+tipo.total)
                tagsPie.push(tipo.opcion+"—"+tipo.municipio+" "+tipo.estado+": "+tipo.total+" interacciones")
              }
              else if(filters.tipo == "edad"){
                labels.push(tipo.opcion+"—"+tipo.edad + " años")
                data.push(tipo.total)
                tags.push("Interacciones: "+tipo.total)
                tagsPie.push(tipo.opcion+"—"+tipo.edad+" años - "+tipo.total+" interacciones")
              }
              else if(filters.tipo == "genero"){
                labels.push(tipo.opcion+" ("+tipo.genero+")")
                data.push(tipo.total)
                tags.push("Interacciones: "+tipo.total)
                tagsPie.push(tipo.opcion+"—"+tipo.genero+": "+tipo.total+" interacciones")
              }    
          });
          var backgrounds = []
          var borders = []
          labels.forEach(() => {
            var color = this.backgroundColorGenerator()
            backgrounds.push(color);
            borders.push(color)
          });
          this.dataGraficas.dataSocialInteractions={
            data:{
              labels: labels,
              datasets: [{
                  label: 'Interacciónes de redes sociales',
                  data: data,
                  backgroundColor: backgrounds,
                  borderColor: borders,
                  borderWidth: 1
              }]
            },
            tagsTooltip : tags,
            tagsToolTipPie : tagsPie
          }
        }else{
          var vistaTipos = response.data.interacciones
          response.data.interacciones.forEach(redSocial => {
            this.interaccionesRedes += redSocial.total
          });
          //this.interaccionesRedes = response.data.interacciones.lenght//30
          /*vistaTipos = [
            {
              opcion:"Facebook", 
              total:3
            },
            {
              opcion:"Whatsapp", 
              total:2
            },
            {
              opcion:"Instagram", 
              total:3
            }
          ]*/
          vistaTipos.forEach(tipo => {
            labels.push(tipo.opcion)
            data.push(tipo.total)
            tags.push("Interacciones: "+tipo.total)
            tagsPie.push(tipo.opcion+": "+tipo.total+" interacciones") 
          });
          var backgrounds = []
          var borders = []
          labels.forEach(() => {
            var color = this.backgroundColorGenerator()
            backgrounds.push(color);
            borders.push(color)
          });
          this.dataGraficas.dataSocialInteractions={
            data:{
              labels: labels,
              datasets: [{
                  label: 'Interacciónes de redes sociales',
                  data: data,
                  backgroundColor: backgrounds,
                  borderColor: borders,
                  borderWidth: 1
              }]
            },
            tagsTooltip : tags,
            tagsToolTipPie : tagsPie
          }
        }
        
       } else{this.loader.loadingVisitsByUrl = false;}        


      },
      () => {
        this.loader.loadingVisitsByUrl = false;
        this.notificationError('Visitas por URL');
      }
    );
  }
  private async getNumeroCompras(filters: StatisticsFilterInterface){    
    this.loader.loadingVisitsByUrl = true;
    await this.business.numero_compras(filters).subscribe(
      response => {
        if(response.code == 200){
          console.log("Estadisticas por Numero de compras: "+JSON.stringify(response))          
        var labels=[]
        var data = []
        var tags = []
        var tagsPie = []
        if(this.filter.tipo != null){
          var vistaTipos = response.data.datos
          /*vistaTipos =[
            {
              edad:15,
              genero:"Hombre",
              municipio:"San Cosme",
              estado:"Tlaxcala",
              total:154
            },
            {
              edad:22,
              genero:"Mujer",
              municipio:"Tlaxcala",
              estado:"Tlaxcala",
              total:56
            }
          ]*/
          vistaTipos.forEach(tipo => {
              if(filters.tipo == "localidad"){
                labels.push(tipo.municipio+" "+tipo.estado)
                data.push(tipo.total)
                tags.push("Compras: "+tipo.total)
                tagsPie.push(tipo.municipio+" "+tipo.estado+": "+tipo.total+" compras")
              }
              else if(filters.tipo == "edad"){
                labels.push(tipo.edad + " años")
                data.push(tipo.total)
                tags.push("Compras: "+tipo.total)
                tagsPie.push(tipo.edad+" años - "+tipo.total+" compras")
              }
              else if(filters.tipo == "genero"){
                labels.push(tipo.genero)
                data.push(tipo.total)
                tags.push("Compras: "+tipo.total)
                tagsPie.push(tipo.genero+": "+tipo.total+" compras")
              }    
          });
          var backgrounds = []
          var borders = []
          labels.forEach(() => {
            var color = this.backgroundColorGenerator()
            backgrounds.push(color);
            borders.push(color)
          });
          this.dataGraficas.dataCompras={
            data:{
              labels: labels,
              datasets: [{
                  label: 'Compras totales',
                  data: data,
                  backgroundColor: backgrounds,
                  borderColor: borders,
                  borderWidth: 1
              }]
            },
            tagsTooltip : tags,
            tagsToolTipPie : tagsPie
          }
        }else{
          this.numeroCompras = response.data.compras
          labels.push("Compras")
          data.push(this.numeroCompras)
          tags.push("Compras totales: "+this.numeroCompras)
          tagsPie.push("Compras totales: "+this.numeroCompras)
          var backgrounds = []
          var borders = []
          labels.forEach(() => {
            var color = this.backgroundColorGenerator()
            backgrounds.push(color);
            borders.push(color)
          });
          this.dataGraficas.dataCompras={
            data:{
              labels: labels,
              datasets: [{
                  label: 'Compras totales',
                  data: data,
                  backgroundColor: backgrounds,
                  borderColor: borders,
                  borderWidth: 1
              }]
            },
            tagsTooltip : tags,
            tagsToolTipPie : tagsPie
          }
        }
        
       } else{this.loader.loadingVisitsByUrl = false;}        


      },
      () => {
        this.loader.loadingVisitsByUrl = false;
        this.notificationError('Visitas por URL');
      }
    );
  }
  private async getNumeroInteraccionesMapa(filters: StatisticsFilterInterface){    
    this.loader.loadingVisitsByUrl = true;
    await this.business.numero_interacciones_mapa(filters).subscribe(
      response => {
        if(response.code == 200){
          console.log("Estadisticas por Interacciones Mapa: "+JSON.stringify(response))
        var labels=[]
        var data = []
        var tags = []
        var tagsPie = []
        if(this.filter.tipo != null){
          var vistaTipos = response.data.datos
          /*vistaTipos =[
            {
              opcion:"Mapa",
              genero:"Mujer",
              localidad:"Apizaco",
              estado:"Tlaxcala",
              edad: 24,
              total:2
            },
            {
              opcion:"Mapa",
              genero:"Hombre",
              localidad:"Cardenas",
              estado:"Tlaxcala",
              edad: 47,
              total:2
            },
            {
              opcion:"Mapa",
              genero:"Mujer",
              localidad:"Tlaxcala",
              estado:"Tlaxcala",
              edad: 29,
              total:2
            },
          ]*/
          vistaTipos.forEach(tipo => {
              if(filters.tipo == "localidad"){
                labels.push(tipo.municipio+" ("+tipo.estado+")")
                data.push(tipo.total)
                tags.push("Interacciónes: "+tipo.total)
                tagsPie.push(tipo.municipio+" ("+tipo.estado+"): "+tipo.total+" interacciónes")
              }
              else if(filters.tipo == "edad"){
                labels.push(tipo.edad + " años")
                data.push(tipo.total)
                tags.push("Interacciónes: "+tipo.total)
                tagsPie.push(tipo.edad+" años - "+tipo.total+" interacciónes")
              }
              else if(filters.tipo == "genero"){
                labels.push(tipo.genero)
                data.push(tipo.total)
                tags.push("Interacciónes: "+tipo.total)
                tagsPie.push(tipo.genero+": "+tipo.total+" interacciónes")
              }    
          });
          var backgrounds = []
          var borders = []
          labels.forEach(() => {
            var color = this.backgroundColorGenerator()
            backgrounds.push(color);
            borders.push(color)
          });
          this.dataGraficas.dataMapInteractions={
            data:{
              labels: labels,
              datasets: [{
                  label: 'Visitas por URL',
                  data: data,
                  backgroundColor: backgrounds,
                  borderColor: borders,
                  borderWidth: 1
              }]
            },
            tagsTooltip : tags,
            tagsToolTipPie : tagsPie
          }
        }else{
          var vistaTipos = response.data.interacciones//.lenght!=0? response.data.interacciones : [{opcion:"Mapa",total:3}]
          /*vistaTipos = [
            {
              opcion:"Mapa",
              total:7
            }
          ]*/
          if(vistaTipos.length>0){
            this.interaccionesMapa = 0
            vistaTipos.forEach(element => {
              this.interaccionesMapa+=element.total
            });
            labels.push("Interacciónes")
            data.push(vistaTipos[0].total)
            tags.push(vistaTipos[0].total+" interacciónes")
            tagsPie.push(vistaTipos[0].total+" interacciónes")
            var backgrounds = []
            var borders = []
            labels.forEach(() => {
              var color = this.backgroundColorGenerator()
              backgrounds.push(color);
              borders.push(color)
            });
            this.dataGraficas.dataMapInteractions={
              data:{
                labels: labels,
                datasets: [{
                    label: "Interacciónes en el "+vistaTipos[0].opcion,
                    data: data,
                    backgroundColor: backgrounds,
                    borderColor: borders,
                    borderWidth: 1
                }]
              },
              tagsTooltip : tags,
              tagsToolTipPie : tagsPie
            }
          }else{
            this.interaccionesMapa = 0
          }
        }
        
       } else{this.loader.loadingVisitsByUrl = false;}        


      },
      () => {
        this.loader.loadingVisitsByUrl = false;
        this.notificationError('Interacciones en el Mapa');
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
              console.log("Features Vacío")  
              
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
    
    if(this.grafica){
      this.grafica.clear();
    }
    if(this.filter.tipo != null){
      //console.log("Tipo"+this.filter.tipo)
      this.tipoEstadistica="Visitas a travéz de "+tipo+" por"
      if(tipo == "QR"){
        this.genBarChartDynamic(this.dataGraficas.dataVisistasQR.data,this.dataGraficas.dataVisistasQR.tagsTooltip)
      }else if(tipo == "URL"){
        this.genBarChartDynamic(this.dataGraficas.dataVisitasUrl.data,this.dataGraficas.dataVisitasUrl.tagsTooltip)
      }
      
    }else{
      //console.log("No selecciono tipo")
      this.tipoEstadistica="Visitas a travéz de "+tipo+" "
      if(tipo == "QR"){
        this.genBarChartDynamic(this.dataGraficas.dataVisistasQR.data,this.dataGraficas.dataVisistasQR.tagsTooltip)
      }else if(tipo == "URL"){
        this.genBarChartDynamic(this.dataGraficas.dataVisitasUrl.data,this.dataGraficas.dataVisitasUrl.tagsTooltip)
      }
    }
  }
  graficaLikesNegocio(tipo:string){
    this.chartType = "pie";
    this.dataSet=tipo
    this.showToggle=true
    this.showToggleRating = false
    
    if(this.grafica){
      this.grafica.clear();
    }
    this.genBarChartDynamic(this.dataGraficas.dataLikesNegocio.data,this.dataGraficas.dataLikesNegocio.tagsTooltip)
    if(this.filter.tipo != null){
      //console.log("Tipo"+this.filter.tipo)
      this.tipoEstadistica="Likes de negocio por "
    }else{
      //console.log("No selecciono tipo")
      this.tipoEstadistica="Likes de negocio "
    }
  }
  graficaRating(tipo:string){
    this.showToggle = true
    this.showToggleRating = false
    this.chartType = "pie";
    this.dataSet=tipo
    const scales = {
        yAxes: [{
          ticks: {
            stepSize: 1,
            beginAtZero: true,
          },
        }],
    }

    if(this.grafica){
      this.grafica.clear();
    }
    if(this.filter.tipo != null){
      this.tipoEstadistica="Calificaciones del negocio por"
      this.genBarChartDynamic(this.ratingData.data,this.ratingData.tagsTooltip)
    }else{
      //console.log("No selecciono tipo")
      this.tipoEstadistica="Calificaciones del negocio"
      this.genBarChartDynamic(this.ratingData.data,null)
    }
  }
  graficaRequerimientos(tipo:string){
    this.chartType = "pie";
    this.dataSet=tipo
    this.showToggle=true
    this.showToggleRating = false
    
    if(this.grafica){
      this.grafica.clear();
    }
    this.genBarChartDynamic(this.dataGraficas.dataReqCompra.data,this.dataGraficas.dataReqCompra.tagsTooltip)

    if(this.filter.tipo != null){
      this.tipoEstadistica="Visitas de requerimientos por"
    }else{
      this.tipoEstadistica="Visitas de requerimientos"
    }
  }
  graficaPromos(tipo:string){
    this.chartType = "pie";
    this.dataSet=tipo
    this.showToggle=true
    this.showToggleRating = false
    
    if(this.grafica){
      this.grafica.clear();
    }
    if(this.filter.tipo != null){
      //console.log("Tipo"+this.filter.tipo)
      this.tipoEstadistica="Visitas de promociónes por"
      this.genBarChartDynamic(this.dataGraficas.dataPromociones.data,this.dataGraficas.dataPromociones.tagsTooltip)
    }else{
      //console.log("No selecciono tipo")
      //console.log("Tipo "+this.filter.tipo)
      this.tipoEstadistica="Visitas de promociónes"
      this.genBarChartDynamic(this.dataGraficas.dataPromociones.data,this.dataGraficas.dataPromociones.tagsTooltip)
    }
  }
  graficaLikesProducts(tipo:string){
    this.chartType = "pie";
    this.dataSet=tipo
    this.showToggle=true
    this.showToggleRating = false
    
    if(this.grafica){
      this.grafica.clear();
    }
    if(this.filter.tipo != null){
      //console.log("Tipo"+this.filter.tipo)
      this.tipoEstadistica="Likes de productos por "
      this.genBarChartDynamic(this.dataGraficas.dataLikesProducts.data,this.dataGraficas.dataLikesProducts.tagsTooltip)
    }else{
      //console.log("No selecciono tipo")
      //console.log("Tipo"+this.filter.tipo)
      this.tipoEstadistica="Likes de productos "
      this.genBarChartDynamic(this.dataGraficas.dataLikesProducts.data,this.dataGraficas.dataLikesProducts.tagsTooltip)
    }
  }
  set_grafica(tipo:string){
    this.showToggle = true
    this.showToggleRating = false
    this.chartType = "pie";
    this.dataSet=tipo

    if(this.grafica){
      this.grafica.clear();
    }
    if(tipo=="redes"){
        this.tipoEstadistica="Interacción en redes sociales"
        this.genBarChartDynamic(this.dataGraficas.dataSocialInteractions.data,this.dataGraficas.dataSocialInteractions.tagsTooltip)
      }
      if(tipo=="compras"){
        this.tipoEstadistica="Compras"
        this.genBarChartDynamic(this.dataGraficas.dataCompras.data,this.dataGraficas.dataCompras.tagsTooltip)
      }
      if(tipo=="interactionsMapa"){
        this.tipoEstadistica="Interacciónes con el mapa"
        this.genBarChartDynamic(this.dataGraficas.dataMapInteractions.data,this.dataGraficas.dataMapInteractions.tagsTooltip)
      }
    if(this.filter.tipo != null){
      if(tipo=="redes"){
        this.tipoEstadistica="Interacción en redes sociales por "
      }
      if(tipo=="compras"){
        this.tipoEstadistica="Compras por "
      }
      if(tipo=="interactionsMapa"){
        this.tipoEstadistica="Interacciónes con el mapa por"
      }
    }else{      
      //console.log("No selecciono tipo")
      if(tipo=="redes"){
        this.tipoEstadistica="Interacción en redes sociales"
      }
      if(tipo=="compras"){
        this.tipoEstadistica="Compras"
      }
      if(tipo=="interactionsMapa"){
        this.tipoEstadistica="Interacciónes con el mapa"
      }

    }
  }
  limitarcaracteres(cadena:string){
    if(cadena.length>50){
      var nombreCorto = cadena.slice(0, 50)
    }
    else{
      nombreCorto = cadena
    }
    return nombreCorto
  }
}
