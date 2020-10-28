import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PedidosNegocioPage } from './pedidos-negocio.page';

describe('PedidosNegocioPage', () => {
  let component: PedidosNegocioPage;
  let fixture: ComponentFixture<PedidosNegocioPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PedidosNegocioPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PedidosNegocioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
