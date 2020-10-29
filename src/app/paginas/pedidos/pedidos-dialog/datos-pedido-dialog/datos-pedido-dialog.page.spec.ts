import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DatosPedidoDialogPage } from './datos-pedido-dialog.page';

describe('DatosPedidoDialogPage', () => {
  let component: DatosPedidoDialogPage;
  let fixture: ComponentFixture<DatosPedidoDialogPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatosPedidoDialogPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DatosPedidoDialogPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
