import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RecuperarContraseniaPage } from './recuperar-contrasenia.page';

describe('RecuperarContraseniaPage', () => {
  let component: RecuperarContraseniaPage;
  let fixture: ComponentFixture<RecuperarContraseniaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecuperarContraseniaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RecuperarContraseniaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
