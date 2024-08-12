import { Injectable } from '@angular/core';
import { Entry } from '../entry';
import Excel from 'exceljs';
import { saveAs } from 'file-saver';
import { EntriesDataService } from '../services/entries-data.service';
import { CloudStorageService } from './cloud-storage.service';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  private fileName: string = "./Entries" + this.getTodaysDateYYYYMMDD() + ".xlsx";
  private rows: Row[] = [];

  constructor(
    private entries: EntriesDataService,
    private cloudStorage: CloudStorageService)
  {
    this.entries.entriesDisplayed.subscribe((entries: Entry[]) => {
      this.rows = [];
      entries.forEach(entry => {
        let images: string[] = [];
        if(entry.image){
          for(let i = 0; i < entry.image.length; i++){
            this.cloudStorage.getFileUrl(entry.image[i]).then(url => {
              images.push(url);
            });
          }
        }
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
          images: images
        }
        this.rows.push(newRow);
      });
    });
  }

  exportToExcel() {
    let workbook = new Excel.Workbook();
    let worksheet = workbook.addWorksheet('WEEK');
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
    this.rows.forEach((row: Row) => {
      worksheet.addRow(row);
    });
    worksheet.addRow({})
    worksheet.addRow({
      smoothB1: this.entries.smoothB1Total.getValue(),
      smoothB2: this.entries.smoothB2Total.getValue(),
      smoothHoQa: this.entries.smoothHoQaTotal.getValue(),
      textureB1: this.entries.textureB1Total.getValue(),
      textureB2: this.entries.textureB2Total.getValue(),
      textureHoQa: this.entries.textureHoQa.getValue(),
      repairsOrWarranty: this.entries.repairsOrWarranty.getValue(),
      observations: 'Total$: ',
      images: this.entries.grandTotal.getValue(),
    });
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

interface Row {}
