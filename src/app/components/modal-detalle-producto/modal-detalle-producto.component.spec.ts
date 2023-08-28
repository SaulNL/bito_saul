import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalDetalleProductoComponent } from './modal-detalle-producto.component';

describe('ModalDetalleProductoComponent', () => {
  let component: ModalDetalleProductoComponent;
  let fixture: ComponentFixture<ModalDetalleProductoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalDetalleProductoComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalDetalleProductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
