import { Component } from '@angular/core';
import { EntriesComponent } from '../entries/entries.component'
import { EntriesDataService } from '../services/entries-data.service';
import { ExcelService } from '../services/excel.service';
import {
  ReactiveFormsModule,
  Validators,
  FormBuilder,
  FormGroup
} from '@angular/forms'

@Component({
  selector: 'app-export-entries',
  standalone: true,
  imports: [
    EntriesComponent,
    ReactiveFormsModule
  ],
  templateUrl: './export-entries.component.html',
  styleUrl: './export-entries.component.css'
})
export class ExportEntriesComponent {

  dateRanges: FormGroup;
  lotAndAddress: FormGroup;

  constructor(
    private fb: FormBuilder,
    private entries: EntriesDataService,
    private excel: ExcelService
  ){
    this.dateRanges = this.fb.group({
      startDate: [Validators.required],
      endDate: [Validators.required]
    });
    this.lotAndAddress = this.fb.group({
      lotNo: [Validators.required],
      address: ['', Validators.required],
    });
  }

  reset(){
    this.entries.filterObjectsByCurrentWeek();
  }

  filterByDate(){
    let startDate = new Date(this.dateRanges.value.startDate);
    let endDate = new Date(this.dateRanges.value.endDate);
    this.entries.filterDisplayedEntriesByDateRange(startDate, endDate);
  }

  filterByLotAndAddress(){
    this.entries.filterLotsByLotNoAndAddress(this.lotAndAddress.value.lotNo, this.lotAndAddress.value.address)
  }

  exportToExcel(){
    this.excel.exportToExcel()
  }

}
