import { Component } from '@angular/core';
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
import { EntriesDataService } from '../services/entries-data.service';

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

  private fileName: string = "./Entries" + this.getTodaysDateYYYYMMDD() + ".xlsx";

  dateRanges: FormGroup;

  constructor(private fb: FormBuilder, private entries: EntriesDataService){
    this.dateRanges = this.fb.group({
      startDate: [Validators.required],
      endDate: [Validators.required]
    });
  }

  onSubmit(){
    let startDate = new Date(this.dateRanges.value.startDate);
    let endDate = new Date(this.dateRanges.value.endDate);
    this.entries.filterDisplayedEntriesByDateRange(startDate, endDate);
  }

  async exportToExcel() {
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet('WEEK');
    const headers = [
      { key: 'date', header: 'DATE' },
      { key: 'lotNo', header: 'LOT No' },
      { key: 'address', header: 'ADDRESS' },
      { key: 'boards', header: 'BOARDS' },
      { key: 'smoothB1', header: 'Smooth B1' },
      { key: 'smoothB2', header: 'Smooth B2' },
      { key: 'smoothHoQa', header: 'Smooth HO/QA' },
      { key: 'textureB1', header: 'Texture B1' },
      { key: 'textureB2', header: 'Texture B2' },
      { key: 'textureHoQa', header: 'Texture HO/QA' },
      { key: 'repairsOrWarranty', header: 'REPAIRS/WARRANTY'},
      { key: 'observations', header: 'OBSERVATIONS' },
      { key: 'images' , header: 'Images'}
    ];
    worksheet.columns = headers;
    this.entries.entriesDisplayed.getValue().forEach((entry: Entry) => {
      let newRow = {
        date: entry.date,
        lotNo: entry.lotNo,
        address: entry.address,
        boards: this.checkForZeros(entry.boards),
        smoothB1: this.checkForZeros(entry.smoothB1),
        smoothB2: this.checkForZeros(entry.smoothB2),
        smoothHoQa: this.checkForZeros(entry.smoothHoQa),
        textureB1: this.checkForZeros(entry.textureB1),
        textureB2: this.checkForZeros(entry.textureB2),
        textureHoQa: this.checkForZeros(entry.textureHoQa),
        repairsOrWarranty: this.checkForZeros(entry.repairsOrWarranty),
      }
      worksheet.addRow(newRow);
    });
    worksheet.addRow({})
    let totatLine = {
      smoothB1: this.entries.smoothB1Total.getValue(),
      smoothB2: this.entries.smoothB2Total.getValue(),
      smoothHoQa: this.entries.smoothHoQaTotal.getValue(),
      textureB1: this.entries.textureB1Total.getValue(),
      textureB2: this.entries.textureB2Total.getValue(),
      textureHoQa: this.entries.textureHoQa.getValue(),
      repairsOrWarranty: this.entries.repairsOrWarranty.getValue(),
      observations: 'Total$: ',
      images: this.entries.grandTotal.getValue(),
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
