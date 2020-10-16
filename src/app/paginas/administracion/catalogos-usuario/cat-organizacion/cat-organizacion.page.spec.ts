import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CatOrganizacionPage } from './cat-organizacion.page';

describe('CatOrganizacionPage', () => {
  let component: CatOrganizacionPage;
  let fixture: ComponentFixture<CatOrganizacionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatOrganizacionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CatOrganizacionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
