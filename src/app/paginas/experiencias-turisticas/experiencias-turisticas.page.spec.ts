import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ExperienciasTuristicasPage } from './experiencias-turisticas.page';

describe('ExperienciasTuristicasPage', () => {
  let component: ExperienciasTuristicasPage;
  let fixture: ComponentFixture<ExperienciasTuristicasPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExperienciasTuristicasPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ExperienciasTuristicasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
