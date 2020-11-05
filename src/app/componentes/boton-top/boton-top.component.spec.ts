import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BotonTopComponent } from './boton-top.component';

describe('BotonTopComponent', () => {
  let component: BotonTopComponent;
  let fixture: ComponentFixture<BotonTopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BotonTopComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BotonTopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
