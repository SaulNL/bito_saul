import { TestBed } from '@angular/core/testing';

import { ExperienciasTuristicasService } from './experiencias-turisticas.service';

describe('ExperienciasTuristicasService', () => {
  let service: ExperienciasTuristicasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExperienciasTuristicasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
