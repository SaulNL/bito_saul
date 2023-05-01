import { TestBed } from '@angular/core/testing';

import { PasarelasService } from './pasarelas.service';

describe('PasarelasService', () => {
  let service: PasarelasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PasarelasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
