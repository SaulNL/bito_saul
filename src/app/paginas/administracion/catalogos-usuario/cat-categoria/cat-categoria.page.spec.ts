import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CatCategoriaPage } from './cat-categoria.page';

describe('CatCategoriaPage', () => {
  let component: CatCategoriaPage;
  let fixture: ComponentFixture<CatCategoriaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatCategoriaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CatCategoriaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
