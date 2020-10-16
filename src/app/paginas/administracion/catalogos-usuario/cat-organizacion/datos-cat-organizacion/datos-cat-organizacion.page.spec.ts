import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DatosCatOrganizacionPage } from './datos-cat-organizacion.page';

describe('DatosCatOrganizacionPage', () => {
  let component: DatosCatOrganizacionPage;
  let fixture: ComponentFixture<DatosCatOrganizacionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatosCatOrganizacionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DatosCatOrganizacionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
