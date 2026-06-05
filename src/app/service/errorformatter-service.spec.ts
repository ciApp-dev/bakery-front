import { TestBed } from '@angular/core/testing';

import { ErrorformatterService } from './errorformatter-service';

describe('ErrorformatterService', () => {
  let service: ErrorformatterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ErrorformatterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
