import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CatDenunciasNegocioPage } from './cat-denuncias-negocio.page';

describe('CatDenunciasNegocioPage', () => {
  let component: CatDenunciasNegocioPage;
  let fixture: ComponentFixture<CatDenunciasNegocioPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatDenunciasNegocioPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CatDenunciasNegocioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
