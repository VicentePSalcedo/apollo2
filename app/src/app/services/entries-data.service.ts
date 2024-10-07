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
  textureHoQaTotal: BehaviorSubject<number> = new BehaviorSubject(0);
  repairsOrWarrantyTotal: BehaviorSubject<number> = new BehaviorSubject(0);
  grandTotal: BehaviorSubject<number> = new BehaviorSubject(0);

  constructor(
    private firestore: FirestoreService,
  ) {
    this.firestore.entries$.pipe().subscribe((value: Entry[]) => {
      let sortedValue = this.sortByTimeStamp(value);
      this.entriesData = sortedValue;
      this.filterObjectsByCurrentWeek();
    });
  }

  filterEntries(
    startDate: Date,
    endDate: Date,
    lotNo: number,
    address: string,
    smoothB1: string,
    smoothB2: string,
    smoothHoQa: string,
    textureB1: string,
    textureB2: string,
    textureHoQa: string,
    repairsOrWarranty: string,
    worker: string,
  )
  {
    if(!this.entriesData) return;
    this.entriesDisplayed.next(this.entriesData.filter(entry => {
      // Check for startDate and endDate
      console.log(startDate + " " + endDate);
      if (startDate && endDate){
        const date = new Date(entry.date);
        if(date <= startDate || date >= endDate) return false;
      }
      if (lotNo && lotNo != entry.lotNo) return false;
      if (address && address != entry.address) return false;
      if (smoothB1 && entry.smoothB1 == 0) return false;
      if (smoothB2 && entry.smoothB2 == 0) return false;
      if (smoothHoQa && entry.smoothHoQa == 0) return false;
      if (textureB1 && entry.textureB1 == 0) return false;
      if (textureB2 && entry.textureB2 == 0) return false;
      if (textureHoQa && entry.textureHoQa == 0) return false;
      if (repairsOrWarranty && entry.repairsOrWarranty == 0) return false;
      if (worker && worker != entry.workers) return false;
      return true;
    }));
    this.calculateTotals()
  }

  sortByTimeStamp(data: Entry[]): Entry[] {
    return data.sort((b, a) => b.timeStamp - a.timeStamp);
  }

  filterObjectsByCurrentWeek(){
    if(!this.entriesData) return;
    const today = new Date();
    const dayOfWeek = today.getDay();
    let startOfWeek = new Date(today);
    if (dayOfWeek === 1) {
        startOfWeek.setHours(0,0,0,0);
    } else {
        const daysToSubtract = (dayOfWeek === 0) ? 6 : dayOfWeek - 1;
        startOfWeek = new Date(today.getTime() - daysToSubtract * 24 * 60 * 60 * 1000);
        startOfWeek.setHours(0, 0, 0, 0);
    }
    let endOfWeek = new Date(today);
    if (dayOfWeek === 0) {
        endOfWeek.setHours(23, 59, 59, 1000);
    } else {
        const daysToAdd = 7 - dayOfWeek;
        endOfWeek = new Date(today.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
        endOfWeek.setHours(23, 59, 59, 999);
    }
    this.entriesDisplayed.next(this.entriesData.filter(entry => {
      const timestampDate = new Date(entry.timeStamp);
      return timestampDate >= startOfWeek && timestampDate <= endOfWeek;
    }));
    this.calculateTotals();
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
    this.textureHoQaTotal.next(textureB2HoQa);
    this.repairsOrWarrantyTotal.next(repairsOrWarranty);
    this.grandTotal.next(grandTotal);
  }

}
