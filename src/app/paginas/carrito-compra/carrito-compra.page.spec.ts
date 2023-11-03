import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CarritoCompraPage } from './carrito-compra.page';

describe('CarritoCompraPage', () => {
  let component: CarritoCompraPage;
  let fixture: ComponentFixture<CarritoCompraPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarritoCompraPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CarritoCompraPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
