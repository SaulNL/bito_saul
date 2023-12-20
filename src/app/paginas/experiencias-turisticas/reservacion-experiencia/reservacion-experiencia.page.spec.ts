import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ReservacionExperienciaPage } from './reservacion-experiencia.page';

describe('ReservacionExperienciaPage', () => {
  let component: ReservacionExperienciaPage;
  let fixture: ComponentFixture<ReservacionExperienciaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReservacionExperienciaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ReservacionExperienciaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
