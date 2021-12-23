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
import { Component, OnInit } from '@angular/core';
import * as Moment from 'moment';
import { ToadNotificacionService } from './../../../api/toad-notificacion.service';

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
  constructor(
    private activated: ActivatedRoute,
    private business: NegocioService,
    private create: CreateObjects,
    private toadNotificacion: ToadNotificacionService,
    private location: Location,
    private popOver: PopoverController,
    private validator: ValidatorData
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
        } else {

        }
      }
    );
  }
  /**
   * @author Juan Antonio Guevara Flores
   * @description Activar el filtro para buscar
   * @param value
   */
  public activetedFilter(value: string) {
    const moment = Moment();
    const day = moment.format(Moment.HTML5_FMT.DATE);
    const filter: StatisticsFilterInterface = new StatisticsFilterModel(this.filters.id_negocio);
    try {
      switch (value) {
        case 'day':
          filter.fecha_inicio = day;
          filter.fecha_final = day;
          this.selected = 'day';
          this.activatedFilter(filter);
          break;
        case 'week':
          this.selected = 'week';
          filter.fecha_inicio = Moment().subtract(7, 'd');
          filter.fecha_final = day;
          this.activatedFilter(filter);
          break;
        case 'month':
          this.selected = 'month';
          filter.fecha_inicio = Moment().subtract(30, 'd');
          filter.fecha_final = day;
          this.activatedFilter(filter);
          break;
        case 'all':
          this.selected = 'all';
          filter.fecha_inicio = null;
          filter.fecha_final = null;
          this.activatedFilter(filter);
          break;
        default:
          this.selected = 'all';
          filter.fecha_inicio = null;
          filter.fecha_final = null;
          this.activatedFilter(filter);
          break;
      }
    } catch (error) {
      filter.fecha_inicio = null;
      filter.fecha_final = null;
      this.activatedFilter(filter);
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
    this.getVisitsByQr(filter);
    this.getVisitsByUrl(filter);
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
        this.statistics.totalVisitsByQr = this.create.anyToNumber(response.data.numero_visto);
        this.loader.loadingVisitsByQr = false;
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
  private getVisitsByUrl(filters: StatisticsFilterInterface) {
    this.loader.loadingVisitsByUrl = true;
    this.business.estadisticaVisitasURL(filters).subscribe(
      response => {
        this.statistics.totalVisitsByUrl = this.create.anyToNumber(response.data.numero_visto);
        this.loader.loadingVisitsByUrl = false;
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
        this.statistics.totalLikesBusiness = this.create.anyToNumber(response.data.numero_likes);
        this.loader.loadingLikesBusiness = false;
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
      response => {
        this.statistics.totalRequests = response.data.length;
        this.statistics.requests = response.data;
        this.loader.loadingTotalRequests = false;
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
      response => {
        this.statistics.totalPromotions = response.data.length;
        this.statistics.promotions = response.data;
        this.loader.loadingTotalPromotions = false;
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
        this.statistics.totalLikesProducts = response.data.length;
        this.statistics.products = response.data;
        this.loader.loadingLikesProducts = false;
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
    return (this.statistics.totalLikesProducts !== 0);
  }
  /**
   * @author Juan Antonio Guevara Flores
   * @description Retorna un Mensaje de error dependiendo del Servicio
   * @param by
   */
  private notificationError(by: string) {
    this.toadNotificacion.error('No se pudo cargar las estaditicas de ' + by);
  }
}
