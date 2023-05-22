import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MisSugerenciasPage } from './mis-sugerencias.page';

describe('MisPreferenciasPage', () => {
  let component: MisSugerenciasPage;
  let fixture: ComponentFixture<MisSugerenciasPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MisSugerenciasPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MisSugerenciasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
