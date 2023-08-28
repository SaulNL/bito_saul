import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InputLugaresEntregaComponent } from './input-lugares-entrega.component';

describe('InputLugaresEntregaComponent', () => {
  let component: InputLugaresEntregaComponent;
  let fixture: ComponentFixture<InputLugaresEntregaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InputLugaresEntregaComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InputLugaresEntregaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
