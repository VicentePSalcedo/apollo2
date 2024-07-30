import { inject, Injectable } from '@angular/core';
import { collectionData, collection, Firestore, CollectionReference, addDoc, DocumentReference } from '@angular/fire/firestore';
import { FirebaseAuthService } from './firebase-auth.service';
import { User } from 'firebase/auth';
import { Observable } from 'rxjs';
import { Entry } from './entry';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  private firestore: Firestore = inject(Firestore);

  user!: User | null;
  entries$?: Observable<Entry[]>;
  entriesCollection!: CollectionReference;

  constructor(private userAuth: FirebaseAuthService) {
    this.userAuth.user$.subscribe((data: User) => {
      this.user = data;
      this.entriesCollection = collection(this.firestore, 'Users/'+ this.user.uid + '/entries/');
      this.entries$ = collectionData(this.entriesCollection) as Observable<Entry[]>;
    })
    console.log(this.entries$);
  }
  addEntry(
    date: String,
    lotNo: Number,
    address: String,
    boards: Number,
    smoothB1: Number,
    smoothB2: Number,
    textureB1: Number,
    textureB2: Number,
    textureHoQa: Number,
    repairsOrWarranty: Number,
    observations: String,
    image: String
  ){
    addDoc(this.entriesCollection, <Entry> {
      date,
      lotNo,
      address,
      boards,
      smoothB1,
      smoothB2,
      textureB1,
      textureB2,
      textureHoQa,
      repairsOrWarranty,
      observations,
      image
    }).then((documentReference: DocumentReference) => {
        console.log(documentReference);
    });
  }
}
