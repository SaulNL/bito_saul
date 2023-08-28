import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalInfoSolicitudComponent } from './modal-info-solicitud.component';

describe('ModalInfoSolicitudComponent', () => {
  let component: ModalInfoSolicitudComponent;
  let fixture: ComponentFixture<ModalInfoSolicitudComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalInfoSolicitudComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalInfoSolicitudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
