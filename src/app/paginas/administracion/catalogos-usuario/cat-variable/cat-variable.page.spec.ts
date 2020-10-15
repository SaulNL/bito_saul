import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CatVariablePage } from './cat-variable.page';

describe('CatVariablePage', () => {
  let component: CatVariablePage;
  let fixture: ComponentFixture<CatVariablePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatVariablePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CatVariablePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
