import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DatosPalabraReservadasPage } from './datos-palabra-reservadas.page';

describe('DatosPalabraReservadasPage', () => {
  let component: DatosPalabraReservadasPage;
  let fixture: ComponentFixture<DatosPalabraReservadasPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatosPalabraReservadasPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DatosPalabraReservadasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
