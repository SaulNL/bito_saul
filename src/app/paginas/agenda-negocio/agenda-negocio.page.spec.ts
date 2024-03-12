import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AgendaNegocioPage } from './agenda-negocio.page';

describe('AgendaNegocioPage', () => {
  let component: AgendaNegocioPage;
  let fixture: ComponentFixture<AgendaNegocioPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgendaNegocioPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AgendaNegocioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
