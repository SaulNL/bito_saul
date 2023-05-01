import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InfinitoScrollComponent } from './infinito-scroll.component';

describe('InfinitoScrollComponent', () => {
  let component: InfinitoScrollComponent;
  let fixture: ComponentFixture<InfinitoScrollComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfinitoScrollComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InfinitoScrollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
