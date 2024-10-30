import { inject, Injectable } from '@angular/core';
import {
  collectionData,
  collection,
  Firestore,
  CollectionReference,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { FirebaseAuthService } from './firebase-auth.service';
import { User } from 'firebase/auth';
import { BehaviorSubject } from 'rxjs';
import { Entry } from '../entry';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  private firestore: Firestore = inject(Firestore);
  private entriesPath: string = '';

  user!: User | null;
  entries$: BehaviorSubject<Entry[]> = new BehaviorSubject<Entry[]>([]);
  entriesCollection!: CollectionReference;

  constructor(private userAuth: FirebaseAuthService) {
    this.userAuth.user$.subscribe((data: User) => {
      this.user = data;
      if(this.user){
        this.entriesPath = 'Users/' + this.user.uid + '/entries/';
        const userEntries = collection(this.firestore, this.entriesPath);
        this.entriesCollection = userEntries;
        collectionData(userEntries).subscribe((cData: Entry[]) => {
          this.entries$.next(cData)
        });
      }
    });
  }

  deletEntry(id: string){
    const docRef = doc(this.firestore, this.entriesPath, id)
    deleteDoc(docRef);
  }

  addEntry(entry: Entry){
    if(this.entriesPath == '') return;
    const docRef = doc(this.firestore, this.entriesPath, entry.id);
    setDoc(docRef, entry);
  }

  editEntry(entry: Entry){
    if(this.entriesPath != ''){
      const docRef = doc(this.firestore, this.entriesPath, entry.id);
      updateDoc(docRef, {
        date: entry.date,
        lotNo: entry.lotNo,
        address: entry.address,
        boards: entry.boards,
        smoothB1: entry.smoothB1,
        smoothB2: entry.smoothB2,
        smoothHoQa: entry.smoothHoQa,
        textureB1: entry.textureB1,
        textureB2: entry.textureB2,
        textureHoQa: entry.textureHoQa,
        repairsOrWarranty: entry.repairsOrWarranty,
        observations: entry.observations,
        image: entry.image,
        workers: entry.workers
      });
    }
  }
}
