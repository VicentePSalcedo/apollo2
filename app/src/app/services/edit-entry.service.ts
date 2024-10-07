import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Entry } from '../entry';
import { Timestamp } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class EditEntryService {
  initialEntry: Entry = {
    id: "",
    timeStamp: 0,
    date: "",
    lotNo: 0,
    address: "",
    boards: 0,
    smoothB1: 0,
    smoothB2: 0,
    smoothHoQa: 0,
    textureB1: 0,
    textureB2: 0,
    textureHoQa: 0,
    repairsOrWarranty: 0,
    observations: "",
    image: [],
    workers: "",
    ttl: Timestamp.now(),
  };
  currentEntry: BehaviorSubject<Entry> = new BehaviorSubject<Entry>(this.initialEntry);
  constructor() { }
}
