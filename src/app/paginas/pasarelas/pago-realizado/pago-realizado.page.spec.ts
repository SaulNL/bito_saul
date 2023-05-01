import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PagoRealizadoPage } from './pago-realizado.page';

describe('PagoRealizadoPage', () => {
  let component: PagoRealizadoPage;
  let fixture: ComponentFixture<PagoRealizadoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PagoRealizadoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PagoRealizadoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
