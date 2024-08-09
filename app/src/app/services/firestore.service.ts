import { inject, Injectable } from '@angular/core';
import {
  collectionData,
  collection,
  Firestore,
  CollectionReference,
  doc,
  setDoc,
  deleteDoc
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
        console.log("fetched from firestore");
      }
    })
  }

  delectEntry(input: string){
    const docRef = doc(this.firestore, this.entriesPath, input)
    deleteDoc(docRef);
  }

  addEntry(date: string, lotNo: number, address: string, boards: number,
    smoothB1: number, smoothB2: number, textureB1: number, textureB2: number,
    textureHoQa: number, repairsOrWarranty: number, observations: string,
    image: string[]
  ){
    let id = objectHash(date + lotNo.toString() + address + boards.toString() +
      smoothB1.toString() + smoothB2.toString() + textureB1.toString() +
      textureB2.toString() + textureHoQa.toString() +
      repairsOrWarranty.toString() + observations + image
    )
    if(this.entriesPath != ''){
      const docRef = doc(this.firestore, this.entriesPath, id);
      const docData = {
        id: id,
        date: date,
        lotNo: lotNo,
        address: address,
        boards: boards,
        smoothB1: smoothB1,
        smoothB2: smoothB2,
        textureB1: textureB1,
        textureB2: textureB2,
        textureHoQa: textureHoQa,
        repairsOrWarranty: repairsOrWarranty,
        observations: observations,
        image: image
      }
      setDoc(docRef, docData);
    }

  }

}
