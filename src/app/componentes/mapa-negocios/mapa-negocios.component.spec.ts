import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MapaNegociosComponent } from './mapa-negocios.component';

describe('MapaNegociosComponent', () => {
  let component: MapaNegociosComponent;
  let fixture: ComponentFixture<MapaNegociosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapaNegociosComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MapaNegociosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
