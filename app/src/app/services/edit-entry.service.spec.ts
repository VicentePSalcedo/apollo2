import { TestBed } from '@angular/core/testing';

import { EditEntryService } from './edit-entry.service';

describe('EditEntryService', () => {
  let service: EditEntryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EditEntryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
