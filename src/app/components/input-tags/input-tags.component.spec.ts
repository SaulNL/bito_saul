import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InputTagsComponent } from './input-tags.component';

describe('InputTagsComponent', () => {
  let component: InputTagsComponent;
  let fixture: ComponentFixture<InputTagsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputTagsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InputTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
