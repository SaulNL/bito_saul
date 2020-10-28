import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MispromocionesPage } from './mispromociones.page';

describe('MispromocionesPage', () => {
  let component: MispromocionesPage;
  let fixture: ComponentFixture<MispromocionesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MispromocionesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MispromocionesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
