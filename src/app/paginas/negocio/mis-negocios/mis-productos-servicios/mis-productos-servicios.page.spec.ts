import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MisProductosServiciosPage } from './mis-productos-servicios.page';

describe('MisProductosServiciosPage', () => {
  let component: MisProductosServiciosPage;
  let fixture: ComponentFixture<MisProductosServiciosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MisProductosServiciosPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MisProductosServiciosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
