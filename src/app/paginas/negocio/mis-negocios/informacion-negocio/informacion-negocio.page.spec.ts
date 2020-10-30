import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InformacionNegocioPage } from './informacion-negocio.page';

describe('InformacionNegocioPage', () => {
  let component: InformacionNegocioPage;
  let fixture: ComponentFixture<InformacionNegocioPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InformacionNegocioPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InformacionNegocioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
