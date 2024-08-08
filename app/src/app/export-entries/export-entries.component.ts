import { Component } from '@angular/core';
import { EntriesComponent } from '../entries/entries.component'
import  * as XLSX from 'xlsx';

@Component({
  selector: 'app-export-entries',
  standalone: true,
  imports: [EntriesComponent],
  templateUrl: './export-entries.component.html',
  styleUrl: './export-entries.component.css'
})
export class ExportEntriesComponent {
  fileName: string = "Entries" + this.getTodaysDateYYYYMMDD() + ".xlsx";

  constructor(){}

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
