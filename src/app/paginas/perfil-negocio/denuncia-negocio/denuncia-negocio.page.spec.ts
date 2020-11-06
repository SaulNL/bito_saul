import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DenunciaNegocioPage } from './denuncia-negocio.page';

describe('DenunciaNegocioPage', () => {
  let component: DenunciaNegocioPage;
  let fixture: ComponentFixture<DenunciaNegocioPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DenunciaNegocioPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DenunciaNegocioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
