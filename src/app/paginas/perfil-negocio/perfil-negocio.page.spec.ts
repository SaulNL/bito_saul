import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PerfilNegocioPage } from './perfil-negocio.page';

describe('PerfilNegocioPage', () => {
  let component: PerfilNegocioPage;
  let fixture: ComponentFixture<PerfilNegocioPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PerfilNegocioPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PerfilNegocioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
