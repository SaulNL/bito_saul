import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AdminSolicitudesPublicadasPage } from './admin-solicitudes-publicadas.page';

describe('AdminSolicitudesPublicadasPage', () => {
  let component: AdminSolicitudesPublicadasPage;
  let fixture: ComponentFixture<AdminSolicitudesPublicadasPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminSolicitudesPublicadasPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminSolicitudesPublicadasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
