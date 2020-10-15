import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DatosCatVariablesPage } from './datos-cat-variables.page';

describe('DatosCatVariablesPage', () => {
  let component: DatosCatVariablesPage;
  let fixture: ComponentFixture<DatosCatVariablesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatosCatVariablesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DatosCatVariablesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
