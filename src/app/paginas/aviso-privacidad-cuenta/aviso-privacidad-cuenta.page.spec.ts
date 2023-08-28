import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AvisoPrivacidadCuentaPage } from './aviso-privacidad-cuenta.page';

describe('AvisoPrivacidadCuentaPage', () => {
  let component: AvisoPrivacidadCuentaPage;
  let fixture: ComponentFixture<AvisoPrivacidadCuentaPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AvisoPrivacidadCuentaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AvisoPrivacidadCuentaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
