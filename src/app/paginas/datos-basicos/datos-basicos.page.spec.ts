import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DatosBasicosPage } from './datos-basicos.page';

describe('DatosBasicosPage', () => {
  let component: DatosBasicosPage;
  let fixture: ComponentFixture<DatosBasicosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatosBasicosPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DatosBasicosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
