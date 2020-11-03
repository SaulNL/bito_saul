import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DatosPysPage } from './datos-pys.page';

describe('DatosPysPage', () => {
  let component: DatosPysPage;
  let fixture: ComponentFixture<DatosPysPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatosPysPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DatosPysPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
