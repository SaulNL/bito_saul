import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DistanciaPromoComponent } from './distancia-promo.component';

describe('DistanciaPromoComponent', () => {
  let component: DistanciaPromoComponent;
  let fixture: ComponentFixture<DistanciaPromoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DistanciaPromoComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DistanciaPromoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
