import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ExploreContainerComponentModule } from '../../explore-container/explore-container.module';

import { PromocionesPage } from './promociones.page';

describe('Tab2Page', () => {
  let component: PromocionesPage;
  let fixture: ComponentFixture<PromocionesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PromocionesPage],
      imports: [IonicModule.forRoot(), ExploreContainerComponentModule]
    }).compileComponents();

    fixture = TestBed.createComponent(PromocionesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
