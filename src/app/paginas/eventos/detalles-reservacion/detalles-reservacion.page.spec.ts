import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DetallesReservacionPage } from './detalles-reservacion.page';

describe('DetallesReservacionPage', () => {
  let component: DetallesReservacionPage;
  let fixture: ComponentFixture<DetallesReservacionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetallesReservacionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DetallesReservacionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
