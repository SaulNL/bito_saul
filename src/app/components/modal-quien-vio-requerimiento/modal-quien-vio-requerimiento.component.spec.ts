import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalQuienVioRequerimientoComponent } from './modal-quien-vio-requerimiento.component';

describe('ModalQuienVioRequerimientoComponent', () => {
  let component: ModalQuienVioRequerimientoComponent;
  let fixture: ComponentFixture<ModalQuienVioRequerimientoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalQuienVioRequerimientoComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalQuienVioRequerimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
