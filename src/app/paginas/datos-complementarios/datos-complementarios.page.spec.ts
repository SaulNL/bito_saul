import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DatosComplementariosPage } from './datos-complementarios.page';

describe('DatosComplementariosPage', () => {
  let component: DatosComplementariosPage;
  let fixture: ComponentFixture<DatosComplementariosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatosComplementariosPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DatosComplementariosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
