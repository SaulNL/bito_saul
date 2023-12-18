import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MisExperienciasTuristicasPage } from './mis-experiencias-turisticas.page';

describe('MisExperienciasTuristicasPage', () => {
  let component: MisExperienciasTuristicasPage;
  let fixture: ComponentFixture<MisExperienciasTuristicasPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MisExperienciasTuristicasPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MisExperienciasTuristicasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
