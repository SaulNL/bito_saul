import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DatosPedidoNegocioPage } from './datos-pedido-negocio.page';

describe('DatosPedidoNegocioPage', () => {
  let component: DatosPedidoNegocioPage;
  let fixture: ComponentFixture<DatosPedidoNegocioPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatosPedidoNegocioPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DatosPedidoNegocioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
