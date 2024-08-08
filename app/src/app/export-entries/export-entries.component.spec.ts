import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportEntriesComponent } from './export-entries.component';

describe('ExportEntriesComponent', () => {
  let component: ExportEntriesComponent;
  let fixture: ComponentFixture<ExportEntriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExportEntriesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExportEntriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
