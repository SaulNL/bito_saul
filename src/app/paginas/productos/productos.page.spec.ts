import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ExploreContainerComponentModule } from '../../explore-container/explore-container.module';

import { ProductosPage } from './productos.page';

describe('Tab1Page', () => {
  let component: ProductosPage;
  let fixture: ComponentFixture<ProductosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProductosPage],
      imports: [IonicModule.forRoot(), ExploreContainerComponentModule]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
