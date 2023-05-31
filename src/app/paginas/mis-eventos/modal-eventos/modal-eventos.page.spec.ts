import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalEventosPage } from './modal-eventos.page';

describe('ModalEventosPage', () => {
  let component: ModalEventosPage;
  let fixture: ComponentFixture<ModalEventosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalEventosPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalEventosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
