import { inject, Injectable } from '@angular/core';
import {
  collectionData,
  collection,
  Firestore,
  CollectionReference,
  doc,
  setDoc,
  deleteDoc,
  updateDoc
} from '@angular/fire/firestore';
import { FirebaseAuthService } from './firebase-auth.service';
import { User } from 'firebase/auth';
import { BehaviorSubject } from 'rxjs';
import { Entry } from '../entry';
import objectHash from 'object-hash';

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

  deletEntry(input: string){
    const docRef = doc(this.firestore, this.entriesPath, input)
    deleteDoc(docRef);
  }

  addEntry(
    date: string,
    lotNo: number,
    address: string,
    boards: number,
    smoothB1: number,
    smoothB2: number,
    smoothHoQa: number,
    textureB1: number,
    textureB2: number,
    textureHoQa: number,
    repairsOrWarranty: number,
    observations: string,
    image: string[],
    workers: string
  ){
    let id = objectHash( date + lotNo.toString() + address + boards.toString() + smoothB1.toString() + smoothB2.toString() + textureB1.toString() + textureB2.toString() + textureHoQa.toString() + repairsOrWarranty.toString() + observations + image + workers)
    if(this.entriesPath != ''){
      const docRef = doc(this.firestore, this.entriesPath, id);
      const docData: Entry = {
        id: id,
        timeStamp: new Date().getTime(),
        date: date,
        lotNo: lotNo,
        address: address,
        boards: boards,
        smoothB1: smoothB1,
        smoothB2: smoothB2,
        smoothHoQa: smoothHoQa,
        textureB1: textureB1,
        textureB2: textureB2,
        textureHoQa: textureHoQa,
        repairsOrWarranty: repairsOrWarranty,
        observations: observations,
        image: image,
        workers: workers
      }
      setDoc(docRef, docData);
    }

  }
  editEntry(
    id: string,
    timeStamp: number,
    date: string,
    lotNo: number,
    address: string,
    boards: number,
    smoothB1: number,
    smoothB2: number,
    smoothHoQa: number,
    textureB1: number,
    textureB2: number,
    textureHoQa: number,
    repairsOrWarranty: number,
    observations: string,
    image: string[],
    workers: string
  ){
    if(this.entriesPath != ''){
      const docRef = doc(this.firestore, this.entriesPath, id);
      updateDoc(docRef, {
        id: id,
        timeStamp: timeStamp,
        date: date,
        lotNo: lotNo,
        address: address,
        boards: boards,
        smoothB1: smoothB1,
        smoothB2: smoothB2,
        smoothHoQa: smoothHoQa,
        textureB1: textureB1,
        textureB2: textureB2,
        textureHoQa: textureHoQa,
        repairsOrWarranty: repairsOrWarranty,
        observations: observations,
        image: image,
        workers: workers
      });
    }
  }

}
