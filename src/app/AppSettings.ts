
export class AppSettings {

    // public static API_ENDPOINT = 'https://bitoo-back.azurewebsites.net/';
    // public static URL_REGISTRO = 'https://bitoo.com.mx/registro';
    // public static URL_FRONT = 'https://bitoo.com.mx/';

    public static API_ENDPOINT = 'https://beta-bitoo-back.azurewebsites.net/';
    public static URL_REGISTRO = 'https://beta-bitoo.azurewebsites.net/registro';
    public static URL_FRONT = 'https://beta-bitoo.azurewebsites.net/';

    // public static API_ENDPOINT = 'http://127.0.0.1:8000/';
    // public static URL_REGISTRO = 'http://127.0.0.1:8000/registro';
    // public static URL_FRONT = 'https://127.0.0.1:4200/';

    public static IMG_ERROR_PRODUCTO = 'https://ecoevents.blob.core.windows.net/comprandoando/img_default/Producto.png';
    public static IMG_ERROR_SERVICIO = 'https://ecoevents.blob.core.windows.net/comprandoando/img_default/Servicio.png';
    public static IMG_ERROR_PROMOCION = 'https://ecoevents.blob.core.windows.net/comprandoando/img_default/Promo%20cuadrada.png';
    public static IMG_ERROR_NEGOCIO = 'https://ecoevents.blob.core.windows.net/comprandoando/img_default/no_imagen.png';
    public static IMG_ERROR_PROMOBANNER = 'https://ecoevents.blob.core.windows.net/comprandoando/img_default/Promo%20banner.png';
    public static IMG_ERROR_SOLICITUD = 'https://ecoevents.blob.core.windows.net/comprandoando/img_default/Promo%20banner.png';
    public static IMG_CATEGORIAS_TODAS = 'https://ecoevents.blob.core.windows.net/comprandoando/Categor%C3%ADas/Separador%20categor%C3%ADa%20web/Todas%20las%20categor%C3%ADas.png';

    public static VERSION_SISTEMA = '27';
    public static ES_MOVIL = false;
    public static NUEVAS_FUNCIONES = true;
    public static APP_DOWNLOAD = 'https://play.google.com/store/apps/details?id=mx.com.softura.bitoo&hl=es';
    public static PROVIDER_ID_GOOGLE = '581785024825-fltko80kfanssgi3hqre8fcslk0iv80e.apps.googleusercontent.com';
    public static PROVIDER_ID_FACEBOOK = '740270933494486';

    public static getHeaders() {
        return {
            'Access-Control-Allow-Origin': '*',
            //    'Access-Control-Allow-Origin' : 'https://bitoo-back.azurewebsites.net/',
            'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Content-Type': 'application/json'
        };
    }


    public static getHeadersToken() {
        return {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            //  'Access-Control-Allow-Origin' : 'https://bitoo-back.azurewebsites.net/',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT',
            'Authorization': ' ',
            'X-CSRF-TOKEN': localStorage.getItem('tk_str'),
            'token': localStorage.getItem('tk_str')
        };
    }

    public static getToken(): string {

        const token = localStorage.getItem('tk_str');

        return token;
    }

    public static setTokenUser(data): boolean {
        if (localStorage.getItem('tk_str')) {
            localStorage.clear();
        }
        localStorage.setItem('tk_str', data.data.token);
        localStorage.setItem('u_data', JSON.stringify(data.data.ms_persona));
        localStorage.setItem('u_privilegio', JSON.stringify(data.data.det_privilegio_usuario));
        localStorage.setItem('u_perfil', data.data.det_usuario_perfil_sistema);
        localStorage.setItem('u_permisos', JSON.stringify(data.data.permisos));
        localStorage.setItem('u_roles', JSON.stringify(data.data.roles));
        localStorage.setItem('u_sistema', JSON.stringify(data.data.usuario_sistema));
        return true;
    }
    public static actualizarDatos(data): boolean {
        localStorage.setItem('u_data', JSON.stringify(data.data.persona));
        localStorage.setItem('u_permisos', JSON.stringify(data.data.persona.permisos));
        localStorage.setItem('u_roles', JSON.stringify(data.data.persona.roles));
        return true;
    }

    public static resetToken(_router) {
        localStorage.clear();
        localStorage.clear();
        // setTimeout(() => {
        //     _router.navigate(['/tabs/inicio']);
        // }, 1000);
        return true;
    }

    public static getTypeMessageByCode(code: number): string {
        let type_message: string;
        switch (code) {
            case 301:
                type_message = 'alert-warning';
                break;
            case 200:
                type_message = 'alert-success';
                break;
            case 500:
                type_message = 'alert-danger';
                break;
            default:
                type_message = 'alert-warning';
                break;
        }
        return type_message;
    }

}
