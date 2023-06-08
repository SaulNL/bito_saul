import { TestBed } from '@angular/core/testing';

import { RnaService } from './rna.service';

describe('RnaService', () => {
  let service: RnaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RnaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
