import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FermularioExperienciasPage } from './fermulario-experiencias.page';

describe('FermularioExperienciasPage', () => {
  let component: FermularioExperienciasPage;
  let fixture: ComponentFixture<FermularioExperienciasPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FermularioExperienciasPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FermularioExperienciasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
