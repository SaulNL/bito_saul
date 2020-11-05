import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { QuieroVenderPage } from './quiero-vender.page';

describe('QuieroVenderPage', () => {
  let component: QuieroVenderPage;
  let fixture: ComponentFixture<QuieroVenderPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuieroVenderPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(QuieroVenderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
