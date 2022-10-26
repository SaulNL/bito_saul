import { Injectable } from '@angular/core';
import { ToastController } from "@ionic/angular";
import Swal  from 'sweetalert2'

@Injectable({
  providedIn: 'root'
})
export class ToadNotificacionService {

  constructor(
    private toadController: ToastController
  ) { }
  /**
   * @author Juan Antonio Guevara Flores
   * @description Muestra mensaje exito
   * @param message
   */
  /*public toastSuccess(message: any) {
    this.exito(message);
  }*/
  /**
   * @author Juan Antonio Guevara Flores
   * @description Muestra mensaje de alerta
   * @param message
   */
  /*public alert(message: any) {
    this.alerta(message);
  }*/
  /** 
   * @author Juan Antonio Guevara Flores
   * @description Muestra mensaje de error
   * @param message
   */
  /*public toastError(message: any) {
    this.configToad('danger', message);
  }

  public successExito(mensaje) {
    this.configToad('success', mensaje);
  }

  public toastWarnig(mensaje) {
    this.configToad('warning', mensaje);
  }

  async configToad(color, mensaje) {
    const toast = await this.toadController.create({
      color: color,
      duration: 2000,
      message: mensaje
    });
    return await toast.present();
  }*/

  /*SWEET ALERT*/
  public exito(title:any/*, time:number,buttonText:any*/){
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-right',
      timer: 2000,
      timerProgressBar: true,
    })
    Toast.fire({
      title: title,
      icon: 'success',
      showDenyButton: false,
      showCancelButton: false,
      showConfirmButton: true,  
      confirmButtonText:'Aceptar',
      confirmButtonColor: '#009413',  
    }).then((result) => {
      if (result.isConfirmed) {          
        
      }else if(result.isDismissed){
        
      }
    }) 
  }
  public success(title:any/*, time:number,buttonText:any*/){
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-right',
      timer: 2000,
      timerProgressBar: true,
    })
    Toast.fire({
      title: title,
      icon: 'success',
      showDenyButton: false,
      showCancelButton: false,
      showConfirmButton: true,  
      confirmButtonText:'Aceptar',
      confirmButtonColor: '#009413',  
    }).then((result) => {
      if (result.isConfirmed) {          
        
      }else if(result.isDismissed){
        
      }
    }) 
  }
  public error(title:any/*, time:number,buttonText:any*/){
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-right',
      timer: 3000,
      timerProgressBar: false,
    })
    Toast.fire({
      title: title,
      icon: 'error',
      showDenyButton: false,
      showCancelButton: false,
      showConfirmButton: false,  
      confirmButtonText:'Aceptar',//buttonText,
      confirmButtonColor: '#cb0000',
    }).then((result) => {
      if (result.isConfirmed) {          
        
      }else if(result.isDismissed){
        
      }
    }) 
  }
  public alerta(title:any/*, time:number,buttonText:any*/){
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-right',
      timer: 2000,
      timerProgressBar: true,
    })
    Toast.fire({
      title: title,
      icon: 'warning',
      showDenyButton: false,
      showCancelButton: false,
      showConfirmButton: false,  
      confirmButtonText:'Aceptar',
      confirmButtonColor: '#FF5733',
    }).then((result) => {
      if (result.isConfirmed) {          
        
      }else if(result.isDismissed){
        
      }
    }) 
  }
  public toastInfo(title:any/*, time:number,buttonText:any*/){
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-right',
      timer: 2000,
      timerProgressBar: true,
    })
    Toast.fire({
      title: title,
      icon: 'info',
      showDenyButton: false,
      showCancelButton: false,
      showConfirmButton: true,  
      confirmButtonText:'Aceptar',
      confirmButtonColor: '#00d4ff',
    }).then((result) => {
      if (result.isConfirmed) {          
        
      }else if(result.isDismissed){
        
      }
    }) 
  }
  public toastQuestion(title:any/*, time:number,buttonText:any*/){
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-right',
      timer: 2000,
      timerProgressBar: true,
    })
    Toast.fire({
      title: title,
      icon: 'question',
      showDenyButton: false,
      showCancelButton: false,
      showConfirmButton: true,  
      confirmButtonText:'Aceptar',
      confirmButtonColor: '#759c79',
    }).then((result) => {
      if (result.isConfirmed) {          
        
      }else if(result.isDismissed){
        
      }
    }) 
  }

  //Alert customizable
  public toastCustomize(position:any,        colorTitulo:any,
    title:any,               time:number,          backgroundToast:any,
    progressBar:boolean,     icon:any,             iconColor:any,
    showDenyButton:boolean,  denyButtonText:any,   denyButtonColor:any, 
    showCancelButton:boolean,cancelButtonText:any, cancelButtonColor:any,
    showConfirmButton:any,   confirmButtonText:any,confirmButtonColor:any,                                                        
    ){

    const Toast = Swal.mixin({
      toast: true,
      position: position,
      timer: time,
      timerProgressBar: progressBar,
      background: backgroundToast,
    })
    Toast.fire({
      title: title,
      icon: icon,//success , error , warning , info , question
      iconColor: iconColor,
      showDenyButton: showDenyButton,
      denyButtonColor: denyButtonColor,
      denyButtonText: denyButtonText,

      showCancelButton: showCancelButton,
      cancelButtonColor: cancelButtonColor,
      cancelButtonText: cancelButtonText,

      showConfirmButton: showConfirmButton,  
      confirmButtonColor: confirmButtonColor,
      confirmButtonText:confirmButtonText,

      color: colorTitulo,    
    }).then((result) => {
      if (result.isConfirmed) {          
        
      }else if(result.isDismissed){
        
      }
    }) 
  }

}
