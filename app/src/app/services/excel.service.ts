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

  private fileName: string = "Entries" + this.getTodaysDateYYYYMMDD() + ".xlsx";
  private rows: Row[] = [];

  constructor(
    private entries: EntriesDataService,
    private cloudStorage: CloudStorageService,
  )
  {
    this.entries.entriesDisplayed.subscribe((entries: Entry[]) => {
      this.rows = [];

      entries.forEach(entry => {
        let image0Url: string[] = [];
        let image0Text: string = ' ';
        let image1Url: string[] = [];
        let image1Text: string = ' ';
        let image2Url: string[] = [];
        let image2Text: string = ' ';
        let image3Url: string[] = [];
        let image3Text: string = ' ';
        let image4Url: string[] = [];
        let image4Text: string = ' ';
        let image5Url: string[] = [];
        let image5Text: string = ' ';
        let image6Url: string[] = [];
        let image6Text: string = ' ';
        let image7Url: string[] = [];
        let image7Text: string = ' ';
        let image8Url: string[] = [];
        let image8Text: string = ' ';
        let image9Url: string[] = [];
        let image9Text: string = ' ';

        if(entry.image[0]){
          this.cloudStorage.getFileUrl(entry.image[0]).then(url => {
            image0Url.push(url);
          });
          image0Text = this.getFileNameFromUrl(entry.image[0]);
        }
        if(entry.image[1]){
          this.cloudStorage.getFileUrl(entry.image[1]).then(url => {
            image1Url.push(url);
          });
          image1Text = this.getFileNameFromUrl(entry.image[1]);
        }
        if(entry.image[2]){
          this.cloudStorage.getFileUrl(entry.image[2]).then(url => {
            image2Url.push(url);
          });
          image2Text = this.getFileNameFromUrl(entry.image[2]);
        }
        if(entry.image[3]){
          this.cloudStorage.getFileUrl(entry.image[3]).then(url => {
            image3Url.push(url);
          });
          image3Text = this.getFileNameFromUrl(entry.image[3]);
        }
        if(entry.image[4]){
          this.cloudStorage.getFileUrl(entry.image[4]).then(url => {
            image4Url.push(url);
          });
          image4Text = this.getFileNameFromUrl(entry.image[4]);
        }
        if(entry.image[5]){
          this.cloudStorage.getFileUrl(entry.image[5]).then(url => {
            image5Url.push(url);
          });
          image5Text = this.getFileNameFromUrl(entry.image[5]);
        }
        if(entry.image[6]){
          this.cloudStorage.getFileUrl(entry.image[6]).then(url => {
            image6Url.push(url);
          });
          image6Text = this.getFileNameFromUrl(entry.image[6]);
        }
        if(entry.image[7]){
          this.cloudStorage.getFileUrl(entry.image[7]).then(url => {
            image7Url.push(url);
          });
          image7Text = this.getFileNameFromUrl(entry.image[7]);
        }
        if(entry.image[8]){
          this.cloudStorage.getFileUrl(entry.image[8]).then(url => {
            image8Url.push(url);
          });
          image8Text = this.getFileNameFromUrl(entry.image[8]);
        }
        if(entry.image[9]){
          this.cloudStorage.getFileUrl(entry.image[9]).then(url => {
            image9Url.push(url);
          });
          image9Text = this.getFileNameFromUrl(entry.image[9]);
        }

        let newRow = [
          '',
          entry.date,
          entry.lotNo + " " + entry.address,
          this.checkForZeros(entry.boards),
          this.checkForZeros(entry.smoothB1),
          this.checkForZeros(entry.smoothB2),
          this.checkForZeros(entry.smoothHoQa),
          this.checkForZeros(entry.textureB1),
          this.checkForZeros(entry.textureB2),
          this.checkForZeros(entry.textureHoQa),
          this.checkForZeros(entry.repairsOrWarranty),
          entry.observations,
          { text: image0Text, hyperlink: image0Url, },
          { text: image1Text, hyperlink: image1Url, },
          { text: image2Text, hyperlink: image2Url, },
          { text: image3Text, hyperlink: image3Url, },
          { text: image4Text, hyperlink: image4Url, },
          { text: image5Text, hyperlink: image5Url, },
          { text: image6Text, hyperlink: image6Url, },
          { text: image7Text, hyperlink: image7Url, },
          { text: image8Text, hyperlink: image8Url, },
          { text: image9Text, hyperlink: image9Url, },
        ];
        this.rows.push(newRow);
      });
    });
  }

  getFileNameFromUrl(fileUrl: string): string {
    if(!fileUrl) return '';
    const regex = /^.*\//;
    return fileUrl.replace(regex, '');
  }

  exportToExcel() {
    let workbook = new Excel.Workbook();
    let worksheet = workbook.addWorksheet('WEEK');

    worksheet.addRow(['', 'CORNESTONE DRYWALL']);
    worksheet.mergeCells(1, 2, 1, 13);
    worksheet.getCell(1, 2).alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.getCell(1, 2).font = { bold: true, size: 18, name: 'Calibri' };
    worksheet.getCell(1, 2).fill = { type: 'pattern', pattern: 'lightGray' };

    worksheet.addRow(['', 'SUB CONTRACTOR:', '', 'MORONTA BROTHER SERVICES LLC'])
    worksheet.mergeCells(2, 2, 2, 3);
    worksheet.getCell(2, 2).alignment = { horizontal: 'right' };
    worksheet.getCell(2, 2).font = { bold: true, size: 11, name: 'Calibri' };
    worksheet.getCell(2, 2).fill = { type: 'pattern', pattern: 'lightGray' };
    worksheet.mergeCells(2, 4, 2, 13);
    worksheet.getCell(2, 5).alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.getCell(2, 5).font = { bold: true, size: 11, name: 'Calibri'  };
    worksheet.getCell(2, 5).fill = { type: 'pattern', pattern: 'lightGray' };

    worksheet.addRow({});
    worksheet.mergeCells(3, 2, 3, 13);

    worksheet.addRow([ '', 'DATE', 'LOT Nº & ADDRESS', 'BOARDS', 'SMOOTH', '', '',
      'TEXTURE', '', '', 'REPAIRS/WARRANTY', 'OBSERVATIONS', 'IMAGES' ]);
    worksheet.addRow([ '', '', '', '', 'B1', 'B2', 'HO/QA', 'B1', 'B2', 'HO/QA' ]);
    worksheet.mergeCells('B4:B5')
    worksheet.mergeCells('C4:C5')
    worksheet.mergeCells('D4:D5')
    worksheet.mergeCells('E4:G4')
    worksheet.mergeCells('H4:J4')
    worksheet.mergeCells('K4:K5')
    worksheet.mergeCells('L4:L5')
    worksheet.mergeCells('M4:M5')

    worksheet.columns[0].width = 2;
    worksheet.columns[1].width = 12;
    worksheet.columns[2].width = 20;
    worksheet.columns[3].width = 6;
    worksheet.columns[10].width = 16;
    worksheet.columns[11].width = 24;


    this.rows.forEach((row: Row) => {
      worksheet.addRow(row);
    });

    worksheet.addRow({})
    worksheet.addRow([
      '',
      '',
      '',
      '',
      this.checkForZeros(this.entries.smoothB1Total.getValue()),
      this.checkForZeros(this.entries.smoothB2Total.getValue()),
      this.checkForZeros(this.entries.smoothHoQaTotal.getValue()),
      this.checkForZeros(this.entries.textureB1Total.getValue()),
      this.checkForZeros(this.entries.textureB2Total.getValue()),
      this.checkForZeros(this.entries.textureHoQa.getValue()),
      this.checkForZeros(this.entries.repairsOrWarranty.getValue()),
      'Total$: ',
      this.entries.grandTotal.getValue(),
    ]);

    worksheet.eachRow({ includeEmpty: false }, (row, rowIndex) => {
      if(3 < rowIndex && rowIndex <= 5) {
        row.eachCell({ includeEmpty: false }, (cell, cellIndex) => {
          if(1 < cellIndex){
            cell.alignment = { horizontal: 'center', vertical: 'middle', shrinkToFit: true };
            cell.font = { bold: true, name: 'Calibri'  }
            cell.fill = { type: 'pattern', pattern: 'lightGray' };
          }
        });
      }
      if(5 < rowIndex){
        row.eachCell({ includeEmpty: false }, (cell, cellIndex) => {
          if(cellIndex == 4 || cellIndex == 12){
            cell.alignment = { horizontal: 'center', vertical: 'middle' , shrinkToFit: true };
            cell.font = { bold: true, name: 'Calibri'  };
          } else if (12 < cellIndex){
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
            cell.font = { name: 'Calibri'  };
          } else {
            cell.alignment = { horizontal: 'center', vertical: 'middle' , shrinkToFit: true };
            cell.font = { name: 'Calibri'  };
          }
        });
      }
      row.eachCell({ includeEmpty: false }, (cell, cellIndex) => {
        if(1 < cellIndex && cellIndex <= 13){
          cell.border = {
            top: { style: 'thin', color: { argb: '000000' } },
            left: { style: 'thin', color: { argb: '000000' } },
            bottom: { style: 'thin', color: { argb: '000000' } },
            right: { style: 'thin', color: { argb: '000000'  } }
          };
        }
      });
    });


    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer]);
      saveAs(blob, `${this.fileName}`);
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
