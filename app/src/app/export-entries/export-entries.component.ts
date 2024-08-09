import { Component, ViewChild } from '@angular/core';
import { EntriesComponent } from '../entries/entries.component'
import {
  ReactiveFormsModule,
  Validators,
  FormBuilder,
  FormGroup
} from '@angular/forms'
import { Entry } from '../entry';
import Excel from 'exceljs';
import { saveAs } from 'file-saver';

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

  private fileName: string = "./Entries" + this.getTodaysDateYYYYMMDD() + ".xlsx";

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
    this.child?.filterDisplayedEntriesByDateRange(this.child.entries, startDate, endDate);
  }

  exportToExcel(): void {
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet('WEEK');
    const headers = [
      { key: 'date', header: 'DATE' },
      { key: 'lotNo', header: 'LOT No' },
      { key: 'address', header: 'ADDRESS' },
      { key: 'boards', header: 'BOARDS' },
      { key: 'smoothB1', header: 'B1' },
      { key: 'smoothB2', header: 'B2' },
      { key: 'textureB1', header: 'B1' },
      { key: 'textureB2', header: 'B2' },
      { key: 'textureHoQa', header: 'HO/QA' },
      { key: 'repairsOrWarranty', header: 'REPAIRS/WARRANTY'},
      { key: 'observations', header: 'OBSERVATIONS' },
      { key: 'total' }
    ];
    worksheet.columns = headers;
    if (!this.child) return;
    this.child.entriesDisplayed.forEach((entry: Entry) => {
      let newRow = {
        date: entry.date,
        lotNo: entry.lotNo,
        address: entry.address,
        boards: this.checkForZeros(entry.boards),
        smoothB1: this.checkForZeros(entry.smoothB1),
        smoothB2: this.checkForZeros(entry.smoothB2),
        textureB1: this.checkForZeros(entry.textureB1),
        textureB2: this.checkForZeros(entry.textureB2),
        textureHoQa: this.checkForZeros(entry.textureHoQa),
        repairsOrWarranty: this.checkForZeros(entry.repairsOrWarranty),
      }
      worksheet.addRow(newRow);
    });
    worksheet.addRow({})
    let totatLine = {
      smoothB1: this.child.smoothB1Total,
      smoothB2: this.child.smoothB2Total,
      textureB1: this.child.textureB1Total,
      textureB2: this.child.textureB2Total,
      textureHoQa: this.child.textureB2HoQa,
      repairsOrWarranty: this.child.repairsOrWarranty,
      observations: 'Total$: ',
      total: this.child.grandTotal
    };
    worksheet.addRow(totatLine);
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer]);
      saveAs(blob, `${this.fileName}.xlsx`);
    });
  }

  checkForZeros(input: number): number | string {
    if(input == 0) return '';
    return input;
  }

  getTodaysDateYYYYMMDD(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

}
