import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalPublicarSolicitudPage } from './modal-publicar-solicitud.page';

describe('ModalPublicarSolicitudPage', () => {
  let component: ModalPublicarSolicitudPage;
  let fixture: ComponentFixture<ModalPublicarSolicitudPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalPublicarSolicitudPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalPublicarSolicitudPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
