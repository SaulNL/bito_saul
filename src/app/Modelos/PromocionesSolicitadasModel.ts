export interface PromocionesSolicitadasModel {
    id_cupon_promocion?: number;
    id_promocion?: number;
    id_persona?: number;
    id_estatus_cupon?: number;
    fc_solicitud?: Date;
    id_persona_aplica?: number;
    fc_aplicacion?: string;
    estatus?:string;
    nombresolicitante?:string;
    paternosolicitante?:string;
    maternosolicitante?:string;
    celular?:string;
    telefono?:string;
    correo?:string;
  }