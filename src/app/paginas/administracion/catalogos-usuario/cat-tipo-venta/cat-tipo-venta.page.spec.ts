import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CatTipoVentaPage } from './cat-tipo-venta.page';

describe('CatTipoVentaPage', () => {
  let component: CatTipoVentaPage;
  let fixture: ComponentFixture<CatTipoVentaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatTipoVentaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CatTipoVentaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
