import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BannerAnunciosComponent } from './banner-anuncios.component';

describe('BannerAnunciosComponent', () => {
  let component: BannerAnunciosComponent;
  let fixture: ComponentFixture<BannerAnunciosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BannerAnunciosComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BannerAnunciosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});