import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EstadisticasPage } from './estadisticas.page';

describe('EstadisticasPage', () => {
  let component: EstadisticasPage;
  let fixture: ComponentFixture<EstadisticasPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EstadisticasPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EstadisticasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
