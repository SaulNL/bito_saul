import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ConocenosPage } from './conocenos.page';

describe('ConocenosPage', () => {
  let component: ConocenosPage;
  let fixture: ComponentFixture<ConocenosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConocenosPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ConocenosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
