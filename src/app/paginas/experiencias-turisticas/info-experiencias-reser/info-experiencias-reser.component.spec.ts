import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InfoExperienciasReserComponent } from './info-experiencias-reser.component';

describe('InfoExperienciasReserComponent', () => {
  let component: InfoExperienciasReserComponent;
  let fixture: ComponentFixture<InfoExperienciasReserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoExperienciasReserComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InfoExperienciasReserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
