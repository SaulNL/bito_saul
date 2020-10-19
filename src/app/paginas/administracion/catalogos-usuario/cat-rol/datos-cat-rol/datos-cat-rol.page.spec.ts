import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DatosCatRolPage } from './datos-cat-rol.page';

describe('DatosCatRolPage', () => {
  let component: DatosCatRolPage;
  let fixture: ComponentFixture<DatosCatRolPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatosCatRolPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DatosCatRolPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
