import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MisNegociosPage } from './mis-negocios.page';

describe('MisNegociosPage', () => {
  let component: MisNegociosPage;
  let fixture: ComponentFixture<MisNegociosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MisNegociosPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MisNegociosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
