import { utf8Encode } from "@angular/compiler/src/util";
import { AppSettings } from "../AppSettings";

declare var jquery: any;
declare var $: any;

export class UtilsCls {
  public static showLoading() {
    $("#panel-loading").fadeIn(1000);
    $("#panel-loading").css("opacity", 0.1 + "!important");
  }

  public static hideLoading() {
    $("#panel-loading").fadeOut(100);
  }

  getIdUsuario(): number {
    let id_usuario = 0;
    try {
      const persona = JSON.parse(localStorage.getItem("u_data"));
      id_usuario = persona.id_persona;
    } catch (e) {
      return 0;
    }

    return id_usuario;
  }

  getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }

  /**
   * funcions nuevas
   * @author: ECR
   */
  public existe_sesion() {
    try {
      const tk_str = localStorage.getItem("tk_str");
      if (tk_str != null && tk_str != "") {
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }

  public getIdUsuarioSistema() {
    let id_usuario = 0;
    try {
      const usuario_sistema = JSON.parse(localStorage.getItem("u_sistema"));
      id_usuario = usuario_sistema.id_usuario_sistema;
      return id_usuario;
    } catch (e) {
      return 0;
    }
  }

  public getIdPersona() {
    let id_persona = 0;
    try {
      const persona = JSON.parse(localStorage.getItem("u_data"));
      id_persona = persona.id_persona;
    } catch (e) {
      return 0;
    }

    return id_persona;
  }

  public getIdProveedor() {
    let id = 0;
    try {
      const persona = JSON.parse(localStorage.getItem("u_data"));
      id = persona.proveedor.id_proveedor;
    } catch (e) {
      return 0;
    }

    return id;
  }

  public is_success_response(code: number) {
    let success = false;
    if (code == 200) {
      success = true;
    }
    return success;
  }

  public checkSelectOther(option_val) {
    let is_other_espacio = false;
    if (
      option_val !== undefined &&
      option_val !== null &&
      (option_val.indexOf("otro") != -1 || option_val.indexOf("Otro") != -1)
    ) {
      is_other_espacio = true;
    }
    return is_other_espacio;
  }

  public check_select_value(option_val, compare_val) {
    let is_compare = false;
    if (
      option_val.indexOf(compare_val) != -1 ||
      option_val.indexOf(compare_val) != -1
    ) {
      is_compare = true;
    }
    return is_compare;
  }

  public initCalendar() {
    $(".daterangepicker").daterangepicker({
      singleDatePicker: true,
      showDropdowns: true,
      locale: {
        format: "DD/MM/YYYY",
        separator: " - ",
        applyLabel: "Aceptar",
        cancelLabel: "Cancelar",
        fromLabel: "Desde",
        toLabel: "Hasta",
        customRangeLabel: "Personalizar",
        weekLabel: "S",
        daysOfWeek: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"],
        monthNames: [
          "Enero",
          "Febrero",
          "Marzo",
          "Abril",
          "Mayo",
          "Junio",
          "Julio",
          "Agosto",
          "Septiembre",
          "Octubre",
          "Noviembre",
          "Diciembre",
        ],
        firstDay: 1,
      },
    });
  }

  /**
   * Quitar caracteres especiales de cadenas
   * Autor: Omar
   */
  public convertir_nombre(cadena: string) {
    if (cadena != "" && cadena != null) {
      let extension = "";

      extension = cadena.slice(((cadena.lastIndexOf(".") - 1) >>> 0) + 2);

      const specialChars = "!@#$^&%*()+=-[]/{}|:<>?,.";

      for (let i = 0; i < specialChars.length; i++) {
        cadena = cadena.replace(new RegExp("\\" + specialChars[i], "gi"), "");
      }
      cadena = cadena.toLowerCase();
      cadena = cadena.replace(/ /gi, "_");
      cadena = cadena.normalize().replace(/\u00e1/gi, "a");
      cadena = cadena.normalize().replace(/\u00e9/gi, "e");
      cadena = cadena.normalize().replace(/\u00ed/gi, "i");
      cadena = cadena.normalize().replace(/\u00f3/gi, "o");
      cadena = cadena.normalize().replace(/\u00fa/gi, "u");
      cadena = cadena.normalize().replace(/\u00f1/gi, "n");
      cadena = cadena + "." + extension;
      return cadena;
    } else {
      return "";
    }
  }

  public validaRfc(rfc) {
    let valido;
    let strCorrecta;
    if (rfc.length === 12) {
      strCorrecta = " " + rfc;
    } else {
      strCorrecta = rfc;
    }
    const valid =
      "^(([A-Z]|[a-z]|s){1})(([A-Z]|[a-z]){3})([0-9]{6})((([A-Z]|[a-z]|[0-9]){3}))";
    const validRfc = new RegExp(valid);
    const matchArray = strCorrecta.match(validRfc);
    if (matchArray == null) {
      valido = false;
    } else {
      valido = true;
    }
    return valido;
  }

  public getRutaPublic() {
    return AppSettings;
  }

  getData() {
    const local = localStorage.getItem("u_data");
    const persona =
      local === null ? local : JSON.parse(localStorage.getItem("u_data"));
    return persona;
  }
  isAuthenticated() {
    const token = localStorage.getItem("tk_str");
    if (token !== null && token !== undefined) {
      return true;
    }
    return false;
  }
  getUserPermisos() {
    if (localStorage.getItem("u_data")) {
      return JSON.parse(localStorage.getItem("u_permisos"));
    }
    return null;
  }
  getUserData() {
    if (localStorage.getItem("u_data")) {
      return JSON.parse(localStorage.getItem("u_data"));
      //return localStorage.getItem('u_data');
    }
    return new Object({});
  }
  getPrivilegio() {
    if (localStorage.getItem("u_sistema")) {
      return JSON.parse(localStorage.getItem("u_sistema"));
      //return localStorage.getItem('u_data');
    }
    return new Object({});
  }

  getIdPrivilegio(): number {
    const data = this.getPrivilegio();
    if (this.isAuthenticated() && data) {
      return data.id_usuario_perfil;
    }
    return 0;
  }
}
