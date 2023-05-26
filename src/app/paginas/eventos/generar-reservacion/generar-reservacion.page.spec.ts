import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GenerarReservacionPage } from './generar-reservacion.page';

describe('GenerarReservacionPage', () => {
  let component: GenerarReservacionPage;
  let fixture: ComponentFixture<GenerarReservacionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenerarReservacionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GenerarReservacionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
