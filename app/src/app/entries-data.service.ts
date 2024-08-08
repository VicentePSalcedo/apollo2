import { Injectable } from '@angular/core';
import { Entry } from './entry';
import { FirebaseAuthService } from './firebase-auth.service';
import { User } from 'firebase/auth';
import { FirestoreService } from './firestore.service';

@Injectable({
  providedIn: 'root'
})
export class EntriesDataService {
  entriesData? : Entry[];
  user!: User | null;

  constructor(
    private userAuth: FirebaseAuthService,
    private firestore: FirestoreService,
  ) {
    this.userAuth.user$.subscribe((data: User | null)=> {
      this.user = data;
      this.firestore.entries$?.subscribe((entries) => {
        this.entriesData = entries;
      });
    });
  }
}
