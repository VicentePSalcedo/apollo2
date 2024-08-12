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
      let sortedValue = this.sortByTimeStamp(value);
      this.entriesData.next(sortedValue);
    });
  }

  sortByTimeStamp(data: Entry[]): Entry[] {
    return data.sort((b, a) => b.timeStamp - a.timeStamp);
  }

  getEntries(): Entry[] {
    return this.entriesData.getValue();
  }

  updateEntriesData(input: Entry[]) {
    this.entriesData.next(input)
  }
}
