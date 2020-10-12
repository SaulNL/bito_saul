import { TestBed } from '@angular/core/testing';

import { ToadNotificacionService } from './toad-notificacion.service';

describe('ToadNotificacionService', () => {
  let service: ToadNotificacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToadNotificacionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
