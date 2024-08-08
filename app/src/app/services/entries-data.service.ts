import { Injectable } from '@angular/core';
import { Entry } from '../entry';
import { FirestoreService } from './firestore.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EntriesDataService {
  entriesData: BehaviorSubject<Entry[]> = new BehaviorSubject<Entry[]>([]);

  constructor(
    private firestore: FirestoreService,
  ) {
    this.firestore.entries$.pipe().subscribe((value: Entry[]) => {
      let uniqueValue = this.removeDuplicates(value);
      let sortedValue = this.sortByDate(uniqueValue);
      this.entriesData.next(sortedValue);
    });
  }

  sortByDate(data: Entry[]): Entry[] {
    return data.sort((a, b) => {
      const dateA = new Date(a.date.toString());
      const dateB = new Date(b.date.toString());
      return dateA.getTime() - dateB.getTime();
    });
  }

  removeDuplicates<T>(array: T[]): T[] {
    return Array.from(new Set(array));
  }

  filterDuplicatesByProperty(arr: Entry[], property: keyof Entry): Entry[] {
    return arr.filter((obj, index, self) => {
      return self.findIndex(o => o[property] === obj[property]) === index;
    });
  }
  getEntries(): Entry[] {
    return this.entriesData.getValue();
  }

  updateEntriesData(input: Entry[]) {
    this.entriesData.next(input)
  }
}
