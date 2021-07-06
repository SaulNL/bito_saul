import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NegociosFavoritosPage } from './negocios-favoritos.page';

describe('NegociosFavoritosPage', () => {
  let component: NegociosFavoritosPage;
  let fixture: ComponentFixture<NegociosFavoritosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NegociosFavoritosPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NegociosFavoritosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
