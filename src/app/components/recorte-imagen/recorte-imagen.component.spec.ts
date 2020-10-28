import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RecorteImagenComponent } from './recorte-imagen.component';

describe('RecorteImagenComponent', () => {
  let component: RecorteImagenComponent;
  let fixture: ComponentFixture<RecorteImagenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecorteImagenComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RecorteImagenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
