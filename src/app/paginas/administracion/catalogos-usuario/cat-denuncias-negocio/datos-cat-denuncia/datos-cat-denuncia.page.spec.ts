import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DatosCatDenunciaPage } from './datos-cat-denuncia.page';

describe('DatosCatDenunciaPage', () => {
  let component: DatosCatDenunciaPage;
  let fixture: ComponentFixture<DatosCatDenunciaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatosCatDenunciaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DatosCatDenunciaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
