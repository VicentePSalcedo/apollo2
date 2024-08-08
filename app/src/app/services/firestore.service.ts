import { inject, Injectable } from '@angular/core';
import {
  collectionData,
  collection,
  Firestore,
  CollectionReference,
  addDoc,
  DocumentReference
} from '@angular/fire/firestore';
import { FirebaseAuthService } from './firebase-auth.service';
import { User } from 'firebase/auth';
import { BehaviorSubject } from 'rxjs';
import { Entry } from '../entry';
import 'object-hash';
import objectHash from 'object-hash';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  private firestore: Firestore = inject(Firestore);

  user!: User | null;
  entries$: BehaviorSubject<Entry[]> = new BehaviorSubject<Entry[]>([]);
  entriesCollection!: CollectionReference;

  constructor(private userAuth: FirebaseAuthService) {
    this.userAuth.user$.subscribe((data: User) => {
      this.user = data;
      if(this.user){
        const userEntries = collection(
          this.firestore,
          'Users/' + this.user.uid + '/entries/'
        );
        this.entriesCollection = userEntries;
        collectionData(userEntries).subscribe((cData: Entry[]) => {
          this.entries$.next(cData)
        });
      }
    })
  }

  addEntry(date: String, lotNo: Number, address: String, boards: Number,
    smoothB1: Number, smoothB2: Number, textureB1: Number, textureB2: Number,
    textureHoQa: Number, repairsOrWarranty: Number, observations: String,
    image: String[]
  ){
    let id = objectHash(date + lotNo.toString() + address + boards.toString() +
      smoothB1.toString() + smoothB2.toString() + textureB1.toString() +
      textureB2.toString() + textureHoQa.toString() +
      repairsOrWarranty.toString() + observations + image
    )

    addDoc(this.entriesCollection, <Entry> {
        id, date, lotNo, address, boards, smoothB1, smoothB2, textureB1,
        textureB2, textureHoQa, repairsOrWarranty, observations, image
    }).then((documentReference: DocumentReference) => {
        console.log(documentReference);
    });

  }

}
