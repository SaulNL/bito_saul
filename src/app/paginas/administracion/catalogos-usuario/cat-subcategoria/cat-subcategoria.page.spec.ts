import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CatSubcategoriaPage } from './cat-subcategoria.page';

describe('CatSubcategoriaPage', () => {
  let component: CatSubcategoriaPage;
  let fixture: ComponentFixture<CatSubcategoriaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatSubcategoriaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CatSubcategoriaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
