import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CambioContraseniaPage } from './cambio-contrasenia.page';

describe('CambioContraseniaPage', () => {
  let component: CambioContraseniaPage;
  let fixture: ComponentFixture<CambioContraseniaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CambioContraseniaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CambioContraseniaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
