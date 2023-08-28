import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FiltrosBusquedaComponent } from './filtros-busqueda.component';

describe('FiltrosBusquedaComponent', () => {
  let component: FiltrosBusquedaComponent;
  let fixture: ComponentFixture<FiltrosBusquedaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltrosBusquedaComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FiltrosBusquedaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
