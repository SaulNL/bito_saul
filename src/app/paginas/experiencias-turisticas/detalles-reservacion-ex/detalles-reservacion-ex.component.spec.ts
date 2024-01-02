import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DetallesReservacionExComponent } from './detalles-reservacion-ex.component';

describe('DetallesReservacionExComponent', () => {
  let component: DetallesReservacionExComponent;
  let fixture: ComponentFixture<DetallesReservacionExComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetallesReservacionExComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DetallesReservacionExComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
