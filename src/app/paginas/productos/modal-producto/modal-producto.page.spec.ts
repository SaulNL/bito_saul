import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalProductoPage } from './modal-producto.page';

describe('ModalProductoPage', () => {
  let component: ModalProductoPage;
  let fixture: ComponentFixture<ModalProductoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalProductoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalProductoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
