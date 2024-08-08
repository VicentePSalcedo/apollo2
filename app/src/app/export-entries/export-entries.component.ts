import { Component, ViewChild } from '@angular/core';
import { EntriesComponent } from '../entries/entries.component'
import {
  ReactiveFormsModule,
  Validators,
  FormBuilder,
  FormGroup
} from '@angular/forms'
import  * as XLSX from 'xlsx';

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
  @ViewChild(EntriesComponent) child?: EntriesComponent;

  fileName: string = "Entries" + this.getTodaysDateYYYYMMDD() + ".xlsx";
  dateRanges: FormGroup;

  constructor(private fb: FormBuilder){
    let today = new Date();
    let thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);
    this.dateRanges = this.fb.group({
      startDate: [thirtyDaysAgo, Validators.required],
      endDate: [today, Validators.required]
    });
  }

  onSubmit(){
    console.log('submitted');
    let startDate = new Date(this.dateRanges.value.startDate);
    let endDate = new Date(this.dateRanges.value.endDate);
    this.child?.filterByDateRange(this.child.entries, startDate, endDate);
  }

  exportToExcel(): void {
    let element = document.getElementById('entryTable');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element)
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, this.fileName);
  }

  getTodaysDateYYYYMMDD(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

}
