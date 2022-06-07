import { Component, OnInit, ViewChild } from '@angular/core';
import {Router} from "@angular/router";
import { IonContent } from '@ionic/angular';
import { ConocenosService } from 'src/app/api/conocenos.service';
import { ImagenConocenos } from 'src/app/Modelos/ImagenesConocenos';

@Component({
  selector: 'app-conocenos',
  templateUrl: './conocenos.page.html',
  styleUrls: ['./conocenos.page.scss'],
})
export class ConocenosPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  public cordenada: number;
  public listImagsConocenos: Array<ImagenConocenos>;
  slideOptsOne = {
    initialSlide: 0,
    slidesPerView: 1,
    autoplay:true
   }; 
  constructor(
    private _router: Router,
    private _conocenosService: ConocenosService
  ) { 
    this.listImagsConocenos = [];
  }

  ngOnInit() {
    this.getListPublicConocenos();
  }

  rutaLink(ruta: string) {
    this._router.navigateByUrl('#' + ruta, {skipLocationChange: true});
    setTimeout(() => this._router.navigate([ruta]));
  }

  private getListPublicConocenos() {
    this._conocenosService.Imagenes().subscribe(
      (response) => {
        this.listImagsConocenos = response.data.listConocenos;
      }, () => {
        //this.listImagsConocenos.push(new ImagenConocenos('https://ecoevents.blob.core.windows.net/comprandoando/conocenos%2Fimagen%201.png'));
      }
    );
  }
}
