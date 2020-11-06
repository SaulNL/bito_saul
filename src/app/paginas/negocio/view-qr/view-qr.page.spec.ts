import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ViewQrPage } from './view-qr.page';

describe('ViewQrPage', () => {
  let component: ViewQrPage;
  let fixture: ComponentFixture<ViewQrPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewQrPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ViewQrPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
