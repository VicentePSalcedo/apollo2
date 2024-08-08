import { TestBed } from '@angular/core/testing';

import { EntriesDataService } from './entries-data.service';

describe('EntriesDataService', () => {
  let service: EntriesDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EntriesDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
