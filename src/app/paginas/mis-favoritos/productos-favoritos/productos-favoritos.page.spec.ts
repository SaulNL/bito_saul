import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ProductosFavoritosPage } from './productos-favoritos.page';

describe('ProductosFavoritosPage', () => {
  let component: ProductosFavoritosPage;
  let fixture: ComponentFixture<ProductosFavoritosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductosFavoritosPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductosFavoritosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
