import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CatRolPage } from './cat-rol.page';

describe('CatRolPage', () => {
  let component: CatRolPage;
  let fixture: ComponentFixture<CatRolPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatRolPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CatRolPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
