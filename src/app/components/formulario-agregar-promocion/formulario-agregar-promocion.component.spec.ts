import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FormularioAgregarPromocionComponent } from './formulario-agregar-promocion.component';

describe('FormularioAgregarPromocionComponent', () => {
  let component: FormularioAgregarPromocionComponent;
  let fixture: ComponentFixture<FormularioAgregarPromocionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormularioAgregarPromocionComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FormularioAgregarPromocionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
