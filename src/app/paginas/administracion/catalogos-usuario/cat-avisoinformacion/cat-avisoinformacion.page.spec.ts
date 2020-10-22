import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CatAvisoinformacionPage } from './cat-avisoinformacion.page';

describe('CatAvisoinformacionPage', () => {
  let component: CatAvisoinformacionPage;
  let fixture: ComponentFixture<CatAvisoinformacionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatAvisoinformacionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CatAvisoinformacionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
