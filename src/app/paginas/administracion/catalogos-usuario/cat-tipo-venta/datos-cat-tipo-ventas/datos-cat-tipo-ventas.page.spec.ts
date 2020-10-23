import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DatosCatTipoVentasPage } from './datos-cat-tipo-ventas.page';

describe('DatosCatTipoVentasPage', () => {
  let component: DatosCatTipoVentasPage;
  let fixture: ComponentFixture<DatosCatTipoVentasPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatosCatTipoVentasPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DatosCatTipoVentasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
