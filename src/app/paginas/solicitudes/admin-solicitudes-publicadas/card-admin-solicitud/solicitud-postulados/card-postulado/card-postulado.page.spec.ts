import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CardPostuladoPage } from './card-postulado.page';

describe('CardPostuladoPage', () => {
  let component: CardPostuladoPage;
  let fixture: ComponentFixture<CardPostuladoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardPostuladoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CardPostuladoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
