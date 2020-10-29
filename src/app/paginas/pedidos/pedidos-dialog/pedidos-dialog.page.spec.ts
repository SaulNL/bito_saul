import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PedidosDialogPage } from './pedidos-dialog.page';

describe('PedidosDialogPage', () => {
  let component: PedidosDialogPage;
  let fixture: ComponentFixture<PedidosDialogPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PedidosDialogPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PedidosDialogPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
