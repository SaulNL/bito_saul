import { ProductImageInterface } from '../../models/product-images-model';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-slider-images',
  templateUrl: './slider-images.component.html',
  styleUrls: ['./slider-images.component.scss'],
})
export class SliderImagesComponent implements OnInit {
  @Input() public productImages: Array<ProductImageInterface>;
  @Input() public images: Array<ProductImageInterface>;

  constructor() {

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
  }
}
