
/**
 * URLS
 *  public static URL_REGISTRO = 'https://bitoo.com.mx/registro';
 *  public static URL_MOVIL = 'https://bitoo.com.mx/';
 *  public static URL_REGISTRO = 'https://beta-bitoo.azurewebsites.net/registro';
 *  public static URL_MOVIL = 'https://beta-bitoo.azurewebsites.net/';
 *  public static API_ENDPOINT = 'https://dev-back-bitoo.azurewebsites.net/';
 *  public static URL_REGISTRO = 'https://dev-front-bitoo.azurewebsites.net/registro';
 *  public static URL_FRONT = 'https://dev-front-bitoo.azurewebsites.net/';
 *  public static URL_MOVIL = '';
 *  public static URL_MOVIL = 'http://app-bitoo.com.mx/tabs/negocio/';
 *  public static API_ENDPOINT = 'http://127.0.0.1:8000/';
 *  public static URL_REGISTRO = 'http://127.0.0.1:8000/registro';
 *  public static URL_FRONT = 'https://127.0.0.1:4200/';
 *  public static API_ENDPOINT = 'https://bitoo-back.azurewebsites.net/';
 *  public static URL_FRONT = 'https://bitoo.com.mx/';
 */

export const URLS_ENTORNOS =
{
  produccion:{
    API_ENDPOINT:'https://api.bitoo.com.mx/',
    URL_REGISTRO:'https://bitoo.com.mx/registro',
    URL_FRONT:'https://bitoo.com.mx/'
  },
  desarrollo: {
    API_ENDPOINT: 'https://dev-back-bitoo.azurewebsites.net/',
    URL_REGISTRO: 'https://dev-front-bitoo.azurewebsites.net/registro',
    URL_FRONT: 'https://dev-front-bitoo.azurewebsites.net/'
  },
  beta: {
    API_ENDPOINT: 'http://132.145.168.176:8081/',
    URL_REGISTRO: 'http://132.145.168.176:8081/registro',
    URL_FRONT: 'https://132.145.168.176:8081/'
  },
  local: {
    API_ENDPOINT: 'http://192.168.1.72/',
    URL_REGISTRO: 'http://192.168.1.72/registro',
    URL_FRONT: 'http://192.168.1.72/'
  }
};