import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PublicarPromocionPage } from './publicar-promocion.page';

describe('PublicarPromocionPage', () => {
  let component: PublicarPromocionPage;
  let fixture: ComponentFixture<PublicarPromocionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicarPromocionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PublicarPromocionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
