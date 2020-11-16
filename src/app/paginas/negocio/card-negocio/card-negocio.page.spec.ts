import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CardNegocioPage } from './card-negocio.page';

describe('CardNegocioPage', () => {
  let component: CardNegocioPage;
  let fixture: ComponentFixture<CardNegocioPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardNegocioPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CardNegocioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
