import { Injectable } from '@angular/core';
// import * as brain from 'brainjs';
import { FiltrosModel } from "../../Modelos/FiltrosModel";
import { AppSettings } from "../../AppSettings";
import { HTTP } from "@ionic-native/http/ngx";
import { from, Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})
export class RnaService {

    public url = `${AppSettings.API_ENDPOINT}`;

    public net: any = null;
    public netN: any = null;

    public data: any = [];
    public responseRNA: any = null;
    public idPersona: number;
    public nNegocios: number;
    public nPromociones: number;
    public nProductos: number;
    public negociosMasVisitados: any = [];

    public productos: any = [];
    public negocios: any = [];
    public promociones: any = [];
    public giros: any = [];

    public filtros: FiltrosModel;

    public preferencias: any = [];

    public userId: any;

    constructor(
        private http: HTTP
    ) {
        const config = {
            binaryThresh: 0.1,
            hiddenLayers: [3],
            activation: 'sigmoid',
            leakyReluAlpha: 0.01,
        };

        this.filtros = new FiltrosModel();
        // this.netN = new brain.recurrent.LSTM();
    }
    /***
     * Funcion que llama a la Red Neural desde el service
     * @param idPersona
     * @param nNegocios
     * @param nProdutos
     * @param nPromociones
     * @author Omar
     */
    public rnaStart(idPersona: number, nNegocios: number, nProdutos: number, nPromociones: number) {
        this.userId = idPersona;
        return new Promise((resolve, reject) => {
            try {

                this.idPersona = idPersona;
                this.nNegocios = nNegocios;
                this.nPromociones = nNegocios;
                this.nProductos = nProdutos;
                let datos = [];
                let preferencia: any = [];

                this.getDataService(idPersona, nNegocios).subscribe(
                    respuesta => {
                        if (respuesta.code === 200) {
                            this.data = respuesta.data;
                            this.negociosMasVisitados = this.data[1];

                            this.buildPreferencias(idPersona).then(preferences => {
                                preferencia = preferences;
                                if (preferencia.length === 0) {
                                    datos = this.negociosMasVisitados.datos;
                                } else {
                                    datos = preferencia;
                                }

                                this.negociosMasVisitados.datos.forEach((item, index) => {
                                    if (index === 0) {
                                        this.trainNet(item.id_giro).then((response) => {
                                            this.runNet(item.id_categoria).then((net) => {
                                                resolve(net);
                                            });
                                        }).catch((dontNet) => {
                                            this.runDontNet(item.id_categoria).then((responseTwo) => {
                                                resolve(responseTwo);
                                            });
                                        });
                                    }
                                });
                            });
                        }
                    },
                    error => {
                        console.error(error);
                    });
            } catch (e) {
                reject(e);
            }
        });
    }

    public runDontNet(idCategoria) {

        return new Promise((resolve, reject) => {
            try {
                const giro = idCategoria.toString();

                this.negociosMasVisitados.datos.filter(item => {
                    this.giros.push(item.id_categoria);
                });

                this.buildNegocios().then(response => {
                    this.negocios = response;
                    this.builPromociones().then(response2 => {
                        this.promociones = response2;

                        this.builProductos().then(response3 => {
                            this.productos = response3;

                            resolve({
                                negocios: this.negocios,
                                promociones: this.promociones,
                                productos: this.productos
                            }
                            );
                        });
                    });
                });
            } catch (e) {
                reject({
                    negocios: null,
                    promociones: null,
                    productos: null
                });
            }
        });
    }
    /**
     * Funcion para ejecuar la predicción de la red
     * @param idCategoria
     * @author Omar
     */
    public runNet(idCategoria) {
        return new Promise((resolve, reject) => {
            try {
                const giro = idCategoria.toString();
                this.responseRNA = this.netN.run(giro);
                const arreglo = this.responseRNA.split('-');

                if (arreglo.length > this.nNegocios) {
                    this.giros = arreglo.splice(0, this.nNegocios);

                } else {
                    this.giros = arreglo;
                }

                this.buildNegocios().then(response => {
                    this.negocios = response;

                    this.builPromociones().then(response2 => {
                        this.promociones = response2;

                        this.builProductos().then(response3 => {
                            this.productos = response3;

                            resolve({
                                negocios: this.negocios,
                                promociones: this.promociones,
                                productos: this.productos
                            }
                            );
                        });
                    });
                });
            } catch (e) {
                reject({
                    negocios: null,
                    promociones: null,
                    productos: null
                });
            }
        });
    }

    /**
     * Funcion para cargar los datos de preferencias
     * @param idPersona
     * @author Omar
     */
    public buildPreferencias(idPersona) {
        return new Promise((resolve) => {
            this.getPreferenciasService(idPersona).subscribe(respuesta => {
                const random = [];
                if (respuesta.code === 200) {

                    const data = respuesta.data;

                    random.push(data.preferencias[Math.floor(Math.random() * data.preferencias.length)]);

                    this.preferencias.push(data.preferencias);
                } else {
                    this.preferencias = [];
                }
                resolve(random);
            });
        });
    }

    /**
     * Funcion para obtener los negocios seguin la respuesta de lad neural
     * @author Omar
     */
    buildNegocios() {
        return new Promise(async (resolve, reject) => {
            this.negocios = [];
            this.filtros.idCategoriaNegocio = this.giros;
            this.filtros.idNegocio = 0;
            this.filtros.id_persona = this.userId;
            this.getNegociosService(this.filtros).subscribe(respuesta => {
                if (respuesta.code === 200) {
                    const data = respuesta.data.lst_cat_negocios.data;

                    if (data.length <= this.nNegocios) {
                        resolve(data);
                    } else {
                        this.negocios = data.splice(0, this.nNegocios);

                        resolve(this.negocios);
                    }
                }
            });
        });
    }
    /**
     * Funcion para obtener las promociones
     * @author Omar
     */
    builPromociones() {
        return new Promise(async (resolve, reject) => {
            this.promociones = [];
            this.filtros.idCategoriaNegocio = this.giros;
            this.filtros.idNegocio = 0;

            this.getPromocionesService(this.filtros).subscribe(respuesta => {
                if (respuesta.code === 200) {
                    const data = respuesta.data;
                    if (data.length <= this.nPromociones) {
                        resolve(data);
                    } else {
                        this.promociones = data.splice(0, this.nPromociones);
                        resolve(this.promociones);
                    }
                }
            });
        });
    }

    /**
     * Funcion para obtener los productos
     * @author Omar
     */
    builProductos() {
        return new Promise(async (resolve, reject) => {
            this.productos = [];
            this.filtros.idCategoriaNegocio = this.giros;
            this.filtros.idNegocio = 0;

            const negocio = this.negociosMasVisitados.datos;
            const id = negocio[Math.floor(Math.random() * negocio.length)];

            this.getProductosService(id.id_negocio).subscribe(respuesta => {
                if (respuesta.code === 200) {
                    const data = respuesta.data.productos;
                    if (data.length <= this.nProductos) {
                        resolve(data);
                    } else {
                        this.productos = data.splice(0, this.nProductos);
                        resolve(this.productos);
                    }
                }
            });
        });
    }

    /**
     * Promesa para entrar la red para determinar que negocios sugerir
     * @param giro
     * @author Omar
     */
    public trainNet(giro) {
        return new Promise(async (resolve, reject) => {
            try {
                let data = [];
                switch (giro) {
                    case 1:
                        data = [
                            { input: '1', output: '1-3-11-18-218' },
                            { input: '2', output: '2-6-8-26-28-29' },
                            { input: '3', output: '3-6-8-16-20' },
                            { input: '4', output: '4-26-13-17-19-219' },
                            { input: '5', output: '5-9-24-218' },
                            { input: '6', output: '6-2-8-26-28' },
                            { input: '7', output: '7-14-15-20-27' },
                            { input: '8', output: '8-2-6-16-20' },
                            { input: '9', output: '9-5-24-218' },
                            { input: '10', output: '10-12-217-218' },
                            { input: '11', output: '1-3-18-218' },
                            { input: '12', output: '15-18' },
                            { input: '13', output: '4-17-21-26-29-19-219' },
                            { input: '14', output: '7-14-15-20-27' },
                            { input: '15', output: '7-14-15-20-27' },
                            { input: '16', output: '3-6-8-16-20' },
                            { input: '17', output: '17-19' },
                            { input: '18', output: '1-3-11-18-218' },
                            { input: '19', output: '4-21-26-13-17-19-219' },
                            { input: '20', output: '8-2-6-16-20' },
                            { input: '21', output: '13-19-26-219' },
                            { input: '22', output: '12' },
                            { input: '23', output: '23' },
                            { input: '24', output: '9-5-24-218' },
                            { input: '25', output: '28' },
                            { input: '26', output: '4-21-26-29-13-17-19-219' },
                            { input: '27', output: '7-14-15-20-27' },
                            { input: '28', output: '6-2-8-26-28' },
                            { input: '29', output: '2-26-219' },
                            { input: '217', output: '2-26-219' },
                            { input: '218', output: '10-12-217-218' },
                            { input: '219', output: '4-21-26-29-13-17-19-219' },
                        ];
                        break;
                    case 2:
                        data = [
                            { input: '30', output: '30-37-40-45' },
                            { input: '31', output: '31-37-42-43-221' },
                            { input: '32', output: '32-37-40-44' },
                            { input: '33', output: '33-37-40' },
                            { input: '34', output: '34-44-45' },
                            { input: '35', output: '35-40-44' },
                            { input: '36', output: '36-40-42-43' },
                            { input: '37', output: '30-32-33-34-35-36-37-38-39-40-41-42-44-45' },
                            { input: '38', output: '37-38-41-45' },
                            { input: '39', output: '39-40' },
                            { input: '40', output: '31-40-43-44-45' },
                            { input: '41', output: '30-34-37-40-41-45' },
                            { input: '42', output: '36-42-43-44-45' },
                            { input: '43', output: '30-31-34-36-40-43-44-45' },
                            { input: '44', output: '31-35-40,44' },
                            { input: '45', output: '30-32-33-34-35-36-37-38-39-40-41-42-44-45' },
                            { input: '220', output: '30-32-33-34-35-36-37-38-39-40-41-42-44-45-220' },
                            { input: '221', output: '30-31-34-35-36-37-42-43-44-221' }
                        ];
                        break;
                    case 3:
                        data = [
                            { input: '46', output: '46-47-51' }, { input: '47', output: '46-47-51' }, { input: '48', output: '48-49-52-54-55-56-57' },
                            { input: '49', output: '48-49-52-53-54-55-55-57' }, { input: '50', output: '47-50-51' }, { input: '51', output: '47-51' },
                            { input: '52', output: '48-49-52-53-54-56-57' }, { input: '53', output: '48-49-53-55' }, { input: '54', output: '48-49-52-54-55-56-57' },
                            { input: '55', output: '54-55-56-57' }, { input: '56', output: '48-52-54-55-56-57' }, { input: '57', output: '48-54-56-57' }
                        ];
                        break;
                    case 4:
                        data = [
                            { input: '58', output: '58-59-65-66-74-76-77-83' }, { input: '59', output: '59-63-64-69-83' }, { input: '60', output: '60-61-65-70-71-76-77-78' },
                            { input: '61', output: '61-65-70-75-76' }, { input: '62', output: '58-59-62-63-64-66-67-68-69-72-77-82-83' }, { input: '63', output: '67-71-82' },
                            { input: '64', output: '59-64-75-83' }, { input: '65', output: '60-61-65-70-71-75' }, { input: '66', output: '66-67-70-75' },
                            { input: '67', output: '63-66-67-69-77' }, { input: '68', output: '68-77-82' }, { input: '69', output: '59-63-67-69-82' },
                            { input: '70', output: '66-70-71-75' }, { input: '71', output: '65-70-71-75' }, { input: '72', output: '62-67-72-74-77' },
                            { input: '73', output: '73-78-80-81' }, { input: '74', output: '58-62-63-67-74-76-77-82-83' }, { input: '75', output: '61-65-66-70-75' },
                            { input: '76', output: '58-67-71-76-77' }, { input: '77', output: '58-62-63-67-66-67-69-77-82' }, { input: '78', output: '60-61-78-80-81' },
                            { input: '79', output: '79-80-81' }, { input: '80', output: '73-79-80-81' }, { input: '81', output: '80-81' },
                            { input: '82', output: '63-67-69-77-82' }, { input: '83', output: '59-63-67-74-83-' }, { input: '225', output: '68-73-225' }
                        ];
                        break;
                    case 5:
                        data = [
                            { input: '84', output: '84-87-91-92-93-94-95-96-97-98-101-102-' }, { input: '85', output: '85-86-89-93-97-98-107-108' }, { input: '86', output: '85-89-93-97-98-104-107-108' },
                            { input: '87', output: '84-87-90' }, { input: '88', output: '88-91-92-102' }, { input: '89', output: '85-89-93-97-98-104-107-108' },
                            { input: '90', output: '87-90-95-103-105' }, { input: '91', output: '91-95-96-102-106' }, { input: '92', output: '91-92' },
                            { input: '93', output: '85-86-89-93-97-98-107-108' }, { input: '94', output: '84-93-94-95-96-97-100-105-106' }, { input: '95', output: '84-87-91-93-95-96-97-102-105-106' },
                            { input: '96', output: '84-87-91-93-95-96-97-102-105-106' }, { input: '97', output: '85-89-93-97-98-104-107-108' }, { input: '98', output: '85-86-89-93-97-98-104-107-108' },
                            { input: '99', output: '90-99' }, { input: '100', output: '87-90-100-103-106' }, { input: '101', output: '84-94-95-96-97-101-106' },
                            { input: '102', output: '95-102-106' }, { input: '103', output: '90-100-103' }, { input: '104', output: '85-93-98-104-107-108' },
                            { input: '105', output: '90-100-103-105' }, { input: '106', output: '95-96-97-101-102-106' }, { input: '107', output: '85-86-89-93-98-104-107-108' },
                            { input: '108', output: '85-86-89-93-98-104-107-108' }
                        ];
                        break;
                    case 6:
                        data = [
                            { input: '109', output: '109-110-113-115-116' }, { input: '110', output: '109-110-115-116' }, { input: '111', output: '111-112-116' },
                            { input: '112', output: '112-113-114-116' }, { input: '113', output: '111-112-113-114-115-116' }, { input: '114', output: '112-113-114-116' },
                            { input: '115', output: '109-110-111-112-113-114-115-116' }, { input: '116', output: '111-113-116' }
                        ];
                        break;
                    case 7:
                        data = [
                            { input: '117', output: '117-121-222' }, { input: '118', output: '118-121-123-222' }, { input: '119', output: '119-121-130-223' },
                            { input: '120', output: '120-122-126' }, { input: '121', output: '119-121-127-128-222-223-224' }, { input: '122', output: '118-120-122-123-127-222-223-224' },
                            { input: '123', output: '118-121-122-123-128-223' }, { input: '124', output: '119-124-127-128-224' }, { input: '125', output: '121-122-123-125-127-130' },
                            { input: '126', output: '117-118-120-126-127-130' }, { input: '127', output: '124-125-126-127-128-129' }, { input: '128', output: '118-123-124-125-126-127-128-129-130' },
                            { input: '129', output: '124-125-126-127-128-129-130' }, { input: '130', output: '129-130' }, { input: '222', output: '119-121-222-223-224' },
                            { input: '223', output: '119-121-222-223-224' }, { input: '224', output: '119-121-222-223-224' }
                        ];
                        break;
                    case 8:
                        data = [
                            { input: '131', output: '131-136-137-144-145-10.001-10.002' }, { input: '132', output: '132-133-134-139-140' }, { input: '133', output: '132-133-134-139-140' },
                            { input: '134', output: '132-133-134-139-140' }, { input: '135', output: '135-136-137-138-143-145-10.001-10.002' }, { input: '136', output: '131-135-136-137-138-143-145-10.001-10.002' },
                            { input: '137', output: '131-135-136-137-138-143-145-10.001-10.002' }, { input: '138', output: '131-135-136-137-138-143-145-10.001-10.002' }, { input: '139', output: '132-133-134-139-140' },
                            { input: '140', output: '132-133-134-139-140' }, { input: '141', output: '140-141-142' }, { input: '142', output: '140-141-142' },
                            { input: '143', output: '131-135-136-137-138-143-145-10.001-10.002' }, { input: '144', output: '139-140-144' }, { input: '145', output: '131-135-136-137-138-143-145-10.001-10.002' },
                            { input: '10.001', output: '135-137-144-145-10.001' }, { input: '10.002', output: '135-137-144-10.001' }, { input: '10.003', output: '131-135-140' }
                        ];
                        break;
                    case 9:
                        data = [
                            { input: '146', output: '146-147-151-152-153-154-162' }, { input: '147', output: '147-148-150-151-152-153-154' }, { input: '148', output: '148-150-151-153-155' },
                            { input: '149', output: '149-151-157-158' }, { input: '150', output: '150-152-155-156-157-159-160-161' }, { input: '151', output: '147-151-162-164' },
                            { input: '152', output: '152-154-156-157-159-160-161' }, { input: '153', output: '148-153-154-155' }, { input: '154', output: '146-147-154' },
                            { input: '155', output: '148-150-155' }, { input: '156', output: '156-163-164' }, { input: '157', output: '157-158' },
                            { input: '158', output: '157-158' }, { input: '159', output: '159-160' }, { input: '160', output: '159-160' },
                            { input: '161', output: '153-161' }, { input: '162', output: '151-153-162' }, { input: '163', output: '156-163-164' },
                            { input: '164', output: '156-163-164' }
                        ];
                        break;
                    case 10:
                        data = [
                            { input: '165', output: '165-168-169-174' }, { input: '166', output: '166-169-170-171-174' }, { input: '167', output: '167-169-170-171-174' },
                            { input: '168', output: '168-169-172-174' }, { input: '169', output: '165-166-167-169-170-171-174' }, { input: '170', output: '167-169-170-174' },
                            { input: '171', output: '170-173-174' }, { input: '172', output: '167-169-172' }, { input: '173', output: '170-173-174' },
                            { input: '174', output: '165-166-167-169-172-173-174' }, { input: '227', output: '169-227' }
                        ];
                        break;
                    case 11:
                        data = [{ input: '175', output: '175-176-177-178-180' }, { input: '176', output: '175-176-177-178-180-182' }, { input: '177', output: '175-176-177-178-179-181-182-184' },
                        { input: '178', output: '175-176-177-178-179-180-181-182-184' }, { input: '179', output: '175-176-177-178-179-180-181-182-184' }, { input: '180', output: '175-176-177-178-179-180-181-182-184' },
                        { input: '181', output: '179-181-182-184' }, { input: '182', output: '179-181-182-184' }, { input: '183', output: '175-177-180-183' },
                        { input: '184', output: '178-179-181-182-184' }];
                        break;
                    case 12:
                        data = [
                            { input: '9999', output: '9999' },
                        ];
                        break;
                    case 13:
                        data = [
                            { input: '185', output: '185-190-191' }, { input: '186', output: '186-187-189-192' }, { input: '187', output: '186-187-189' },
                            { input: '188', output: '188-190-191' }, { input: '189', output: '186-187-189-192' }, { input: '190', output: '185-188-190-191' },
                            { input: '191', output: '185-190-191' }, { input: '192', output: '186-192' },
                        ];
                        break;
                    case 14:
                        data = [
                            { input: '193', output: '193-195' }, { input: '194', output: '194-195' }, { input: '195', output: '194-195-197-200' },
                            { input: '196', output: '196-197-200' }, { input: '197', output: '196-197-199-200' }, { input: '198', output: '198' },
                            { input: '199', output: '196-199' }, { input: '200', output: '196-197-199-200' },
                        ];
                        break;
                    case 15:
                        data = [
                            { input: '201', output: '201-202-203' }, { input: '202', output: '201-202-203-205-207' }, { input: '203', output: '203-204-205-208' },
                            { input: '204', output: '204-205-206-207-208' }, { input: '205', output: '202-205-207-208' }, { input: '206', output: '202-204-205-206-208' },
                            { input: '207', output: '201-203-204-205-206-207-208' }, { input: '208', output: '204-206-208' }
                        ];
                        break;
                    case 16:
                        data = [
                            { input: '209', output: '209-210-211-212-215' }, { input: '210', output: '210-211-212-213-214-215-226-10.004' }, { input: '211', output: '209-210-211-212-215-226' },
                            { input: '212', output: '211-212-215-216' }, { input: '213', output: '213-214-10.004' }, { input: '214', output: '213-214-10.004' },
                            { input: '215', output: '209-211-212-215-216' }, { input: '216', output: '211-215-216' }, { input: '226', output: '210-211-212-215-226' },
                            { input: '10.004', output: '213-214-10.004' }
                        ];
                        break;
                    default:
                        data = [
                            { input: '9999', output: '9999' },
                        ];
                        break;
                }
                this.netN.train(data, {
                    iterations: 20,
                    timeout: 5,
                });
                resolve(data);
            } catch (e) {
                reject(false);
            }
        });
    }

    /**
     * Funcion para obtener los datos del servicio para la red neural
     * @param idPesona
     * @param canitdad
     * @author Omar
     */
    getDataService(idPesona: number, cantidad: number): Observable<any> {
        try {
            const body = JSON.stringify({ id_persona: idPesona, cantidad });
            return from(this.http.post(
                this.url + 'api/negocios/obtenerMasVistosUsuario', body,
                AppSettings.getHeadersToken()).then(data => {
                    return JSON.parse(data.data);
                }).catch((error) => {
                    return error;
                })).pipe(map(data => {
                    return data;
                }));
        } catch (e) {
            console.error('Hay un error en el servicio de la red neural: ', e);
        }
    }
    /**
     * Funcion para obtener los datos de promociones
     * @author Omar
     * @param id_negocio
     */
    getPromocionesService(filtros: FiltrosModel): Observable<any> {
        try {
            const body = JSON.stringify({ filtros });
            return from(this.http.post(
                this.url + 'api/promociones/buscar/publicadas', body,
                AppSettings.getHeadersToken()).then(data => {
                    return JSON.parse(data.data);
                }).catch((error) => {
                    return error;
                })).pipe(map(data => {
                    return data;
                }));
        } catch (e) {
            console.error('Hay un error en el servicio de la red neural: ', e);
        }
    }

    /**
     * Funcion para obtener los datos del negocio
     * @param filtros
     * @author Omar
     */
    getNegociosService(filtros: FiltrosModel): Observable<any> {
        try {
            const body = JSON.stringify({ filtros });
            return from(this.http.post(
                this.url + 'api/negocios/obtener', body,
                AppSettings.getHeadersToken()).then(data => {
                    return JSON.parse(data.data);
                }).catch((error) => {
                    return error;
                })).pipe(map(data => {
                    return data;
                }));
        } catch (e) {
            console.error('Hay un error en el servicio de la red neural: ', e);
        }
    }

    /**
     * Funcion para obtener el listado de productos
     * @param id_negocio
     * @author Omar
     */
    getProductosService(idNegocio: number): Observable<any> {
        try {
            const body = JSON.stringify({ id_negocio: idNegocio });
            return from(this.http.post(
                this.url + 'api/lista/producto/negocio', body,
                AppSettings.getHeadersToken()).then(data => {
                    return JSON.parse(data.data);
                }).catch((error) => {
                    return error;
                })).pipe(map(data => {
                    return data;
                }));
        } catch (e) {
            console.error('Hay un error en el servicio de la red neural: ', e);
        }
    }

    /**
     * Funcion para obtener las preferencias del usuario
     * @param idNegocio
     * @author Omar
     */
    getPreferenciasService(idPersona: number): Observable<any> {
        try {
            const body = JSON.stringify({ id_persona: idPersona });
            return from(this.http.post(
                this.url + 'api/preferencias/persona/obtener', body,
                AppSettings.getHeadersToken()).then(data => {
                    return JSON.parse(data.data);
                }).catch((error) => {
                    return error;
                })).pipe(map(data => {
                    return data;
                }));
        } catch (e) {
            console.error('Hay un error en el servicio de la red neural: ', e);
        }
    }
}
