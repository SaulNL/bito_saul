import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DatosContactoPage } from './datos-contacto.page';

describe('DatosContactoPage', () => {
  let component: DatosContactoPage;
  let fixture: ComponentFixture<DatosContactoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatosContactoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DatosContactoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
