import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalInicioSesionPage } from './modal-inicio-sesion.page';

describe('ModalInicioSesionPage', () => {
  let component: ModalInicioSesionPage;
  let fixture: ComponentFixture<ModalInicioSesionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalInicioSesionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalInicioSesionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
