import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.page.html',
  styleUrls: ['./footer.page.scss'],
})
export class FooterPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

    /**
   * Funcion para abrir los terminos y condiciones
   * @author Omar
   */
  public abrirTerminosCondiciones(){
    const pdfWindow = window.open('');
    pdfWindow.document.write("<html<head><title>"+"Términos y Condiciones Bitoo"+"</title><style>body{margin: 0px;}iframe{border-width: 0px;}</style></head>");
    pdfWindow.document.write("<body><embed width='100%' height='100%' src='https://ecoevents.blob.core.windows.net/comprandoando/documentos%2FTERMINOS%20Y%20CONDICIONES%20Bitoo.pdf'></embed></body></html>");
  }

}
