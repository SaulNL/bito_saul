import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InfoNegocioPage } from './info-negocio.page';

describe('InfoNegocioPage', () => {
  let component: InfoNegocioPage;
  let fixture: ComponentFixture<InfoNegocioPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoNegocioPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InfoNegocioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
