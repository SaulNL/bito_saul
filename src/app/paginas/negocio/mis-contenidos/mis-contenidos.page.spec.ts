import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MisContenidosPage } from './mis-contenidos.page';

describe('MisContenidosPage', () => {
  let component: MisContenidosPage;
  let fixture: ComponentFixture<MisContenidosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MisContenidosPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MisContenidosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
