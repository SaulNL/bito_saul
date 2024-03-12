import { TestBed } from '@angular/core/testing';

import { AgendaContenidosService } from './agenda-contenidos.service';

describe('AgendaContenidosService', () => {
  let service: AgendaContenidosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AgendaContenidosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
