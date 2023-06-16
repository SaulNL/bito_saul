import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BrokersPage } from './brokers.page';

describe('BrokersPage', () => {
  let component: BrokersPage;
  let fixture: ComponentFixture<BrokersPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrokersPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BrokersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
