import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DatosProductosServiciosPage } from './datos-productos-servicios.page';

describe('DatosProductosServiciosPage', () => {
  let component: DatosProductosServiciosPage;
  let fixture: ComponentFixture<DatosProductosServiciosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatosProductosServiciosPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DatosProductosServiciosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
