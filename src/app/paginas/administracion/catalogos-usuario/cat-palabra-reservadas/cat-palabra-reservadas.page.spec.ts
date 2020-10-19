import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CatPalabraReservadasPage } from './cat-palabra-reservadas.page';

describe('CatPalabraReservadasPage', () => {
  let component: CatPalabraReservadasPage;
  let fixture: ComponentFixture<CatPalabraReservadasPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatPalabraReservadasPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CatPalabraReservadasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
