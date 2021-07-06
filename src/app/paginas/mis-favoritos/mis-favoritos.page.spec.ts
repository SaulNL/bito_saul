import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MisFavoritosPage } from './mis-favoritos.page';

describe('MisFavoritosPage', () => {
  let component: MisFavoritosPage;
  let fixture: ComponentFixture<MisFavoritosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MisFavoritosPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MisFavoritosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
