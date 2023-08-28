import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CargarImagenesSlideComponent } from './cargar-imagenes-slide.component';

describe('CargarImagenesSlideComponent', () => {
  let component: CargarImagenesSlideComponent;
  let fixture: ComponentFixture<CargarImagenesSlideComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CargarImagenesSlideComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CargarImagenesSlideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
