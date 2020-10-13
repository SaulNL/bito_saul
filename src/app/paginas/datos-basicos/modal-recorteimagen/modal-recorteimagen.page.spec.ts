import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalRecorteimagenPage } from './modal-recorteimagen.page';

describe('ModalRecorteimagenPage', () => {
  let component: ModalRecorteimagenPage;
  let fixture: ComponentFixture<ModalRecorteimagenPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalRecorteimagenPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalRecorteimagenPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
