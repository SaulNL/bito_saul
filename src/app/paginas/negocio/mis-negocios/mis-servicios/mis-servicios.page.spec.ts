import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MisServiciosPage } from './mis-servicios.page';

describe('MisServiciosPage', () => {
  let component: MisServiciosPage;
  let fixture: ComponentFixture<MisServiciosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MisServiciosPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MisServiciosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
