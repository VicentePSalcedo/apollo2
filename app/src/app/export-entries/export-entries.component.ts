import { Component } from '@angular/core';
import { EntriesDataService } from '../services/entries-data.service';
import { ExcelService } from '../services/excel.service';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup
} from '@angular/forms'

@Component({
  selector: 'app-export-entries',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './export-entries.component.html',
  styleUrl: './export-entries.component.css'
})
export class ExportEntriesComponent {

  filter: FormGroup;

  constructor(
    private fb: FormBuilder,
    private entries: EntriesDataService,
    private excel: ExcelService
  ){
    this.filter = this.fb.group({
      startDate: [],
      endDate: [],
      lotNo: [],
      address: [],
      smoothB1: [],
      smoothB2: [],
      smoothHoQa: [],
      textureB1: [],
      textureB2: [],
      textureHoQa: [],
      repairsOrWarranty: [],
      worker: [],
    });
  }

  applyFilter(){
    console.log(this.filter.value);
    this.entries.filterEntries(
      this.filter.value.startDate,
      this.filter.value.endDate,
      this.filter.value.lotNo,
      this.filter.value.address,
      this.filter.value.smoothB1,
      this.filter.value.smoothB2,
      this.filter.value.smoothHoQa,
      this.filter.value.textureB1,
      this.filter.value.textureB2,
      this.filter.value.textureHoQa,
      this.filter.value.repairsOrWarranty,
      this.filter.value.worker,
    )
  }

  reset(){
    this.entries.filterObjectsByCurrentWeek();
    this.filter.reset();
  }

  exportToExcel(){
    this.excel.exportToExcel()
  }

}
