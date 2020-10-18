import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DatosAvisosInformacionPage } from './datos-avisos-informacion.page';

describe('DatosAvisosInformacionPage', () => {
  let component: DatosAvisosInformacionPage;
  let fixture: ComponentFixture<DatosAvisosInformacionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatosAvisosInformacionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DatosAvisosInformacionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
