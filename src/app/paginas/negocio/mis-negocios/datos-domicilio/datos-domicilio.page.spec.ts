import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DatosDomicilioPage } from './datos-domicilio.page';

describe('DatosDomicilioPage', () => {
  let component: DatosDomicilioPage;
  let fixture: ComponentFixture<DatosDomicilioPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatosDomicilioPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DatosDomicilioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
