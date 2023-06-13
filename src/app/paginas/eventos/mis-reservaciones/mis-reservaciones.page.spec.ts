import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MisReservacionesPage } from './mis-reservaciones.page';

describe('MisReservacionesPage', () => {
  let component: MisReservacionesPage;
  let fixture: ComponentFixture<MisReservacionesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MisReservacionesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MisReservacionesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
