import { ProductImageInterface } from '../../models/product-images-model';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-slider-images',
  templateUrl: './slider-images.component.html',
  styleUrls: ['./slider-images.component.scss'],
})
export class SliderImagesComponent implements OnInit {
  @Input() public productImages: Array<ProductImageInterface>;
  public images: Array<ProductImageInterface>;
  // public image: ProductImagesInterface;
  // public isManyImages: boolean;
  constructor() {
    // this.isManyImages = true;
  }

  slidesOptions = {
    slidesPerView: 1.5,
    centeredSlides: true,
    loop: false,
    spaceBetween: 10,
  };

  ngOnInit() {
    this.slidesOptions;
    this.images = this.productImages;
    // if (this.productImages.length > 1) {
    //   this.images = this.productImages;
    //   this.isManyImages = true;
    // } else {
    //   this.isManyImages = false;
    //   this.image = this.productImages[0];
    // }
  }
}
