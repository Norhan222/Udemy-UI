import { TestBed } from '@angular/core/testing';

import { V } from './v';

describe('V', () => {
  let service: V;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(V);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
