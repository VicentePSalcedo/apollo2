import { Injectable } from '@angular/core';
import { Entry } from '../entry';
import { FirestoreService } from './firestore.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EntriesDataService {
  entriesData?: Entry[];

  entriesDisplayed: BehaviorSubject<Entry[]> = new BehaviorSubject<Entry[]>([]);
  smoothB1Total: BehaviorSubject<number> = new BehaviorSubject(0);
  smoothB2Total: BehaviorSubject<number> = new BehaviorSubject(0);
  smoothHoQaTotal: BehaviorSubject<number> = new BehaviorSubject(0);
  textureB1Total: BehaviorSubject<number> = new BehaviorSubject(0);
  textureB2Total: BehaviorSubject<number> = new BehaviorSubject(0);
  textureHoQa: BehaviorSubject<number> = new BehaviorSubject(0);
  repairsOrWarranty: BehaviorSubject<number> = new BehaviorSubject(0);
  grandTotal: BehaviorSubject<number> = new BehaviorSubject(0);

  constructor(
    private firestore: FirestoreService,
  ) {
    this.firestore.entries$.pipe().subscribe((value: Entry[]) => {
      let sortedValue = this.sortByTimeStamp(value);
      this.entriesData = sortedValue;
      this.entriesDisplayed.next(this.filterObjectsByCurrentWeek(this.entriesData));
      this.calculateTotals();
    });
  }
  filterObjectsByCurrentWeek(data: Entry[]): Entry[] {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay() + 1); // Adjust to Monday
    startOfWeek.setHours(0, 0, 0, 0);
    console.log(startOfWeek);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
    console.log(endOfWeek);

    return data.filter(entry => {
      const timestampDate = new Date(entry.timeStamp);
      return timestampDate >= startOfWeek && timestampDate <= endOfWeek;
    });
  }

  calculateTotals() {
    let smoothB1Total: number = 0;
    let smoothB2Total: number = 0;
    let smoothHoQaTotal: number = 0;
    let textureB1Total: number = 0;
    let textureB2Total: number = 0;
    let textureB2HoQa: number = 0;
    let repairsOrWarranty: number = 0;
    let grandTotal: number = 0;
    this.entriesDisplayed.getValue().forEach(entry => {
      if(entry.smoothB1)smoothB1Total = smoothB1Total + entry.smoothB1;
      if(entry.smoothB2)smoothB2Total = smoothB2Total + entry.smoothB2;
      if(entry.smoothHoQa)smoothHoQaTotal = smoothHoQaTotal + entry.smoothHoQa;
      if(entry.textureB1)textureB1Total = textureB1Total + entry.textureB1;
      if(entry.textureB2)textureB2Total = textureB2Total + entry.textureB2;
      if(entry.textureHoQa)textureB2HoQa = textureB2HoQa + entry.textureHoQa;
      if(entry.repairsOrWarranty)repairsOrWarranty = repairsOrWarranty + entry.repairsOrWarranty;
    })
    grandTotal = smoothB1Total + smoothB2Total + smoothHoQaTotal + textureB1Total
      + textureB2Total + textureB2HoQa + repairsOrWarranty;
    this.smoothB1Total.next(smoothB1Total);
    this.smoothB2Total.next(smoothB2Total);
    this.smoothHoQaTotal.next(smoothHoQaTotal);
    this.textureB1Total.next(textureB1Total);
    this.textureB2Total.next(textureB2Total);
    this.textureHoQa.next(textureB2HoQa);
    this.repairsOrWarranty.next(repairsOrWarranty);
    this.grandTotal.next(grandTotal);
  }

  filterDisplayedEntriesByDateRange(startDate: Date, endDate: Date)  {
    if(!this.entriesData) return;
    this.entriesDisplayed.next(this.entriesData.filter(item => {
      const itemDate = new Date(item.date); // Ensure item.date is a Date object
      return itemDate >= startDate && itemDate <= endDate;
    }));
    this.calculateTotals();
  }

  sortByTimeStamp(data: Entry[]): Entry[] {
    return data.sort((b, a) => b.timeStamp - a.timeStamp);
  }

}
