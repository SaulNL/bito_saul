import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ListaReservacionExperienciasPage } from './lista-reservacion-experiencias.page';

describe('ListaReservacionExperienciasPage', () => {
  let component: ListaReservacionExperienciasPage;
  let fixture: ComponentFixture<ListaReservacionExperienciasPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaReservacionExperienciasPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ListaReservacionExperienciasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
