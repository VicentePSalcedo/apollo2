import { Component, OnDestroy, OnInit } from '@angular/core';
import { FirestoreService } from '../firestore.service';
import { Entry } from '../entry';
import { Subscription } from 'rxjs';
import { User } from 'firebase/auth';
import { FirebaseAuthService } from '../firebase-auth.service';

@Component({
  selector: 'app-entries',
  standalone: true,
  imports: [],
  templateUrl: './entries.component.html',
  styleUrl: './entries.component.css'
})
export class EntriesComponent implements OnInit, OnDestroy {

  private userSubscription$!: Subscription;

  entries?: Entry[];
  user!: User | null;

  constructor(private userAuth: FirebaseAuthService,private firestore: FirestoreService){
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

  ngOnInit(): void {
    this.userSubscription$ = this.userAuth.user$.subscribe((data: User | null)=> {
      this.user = data;
      if(this.user && this.firestore.entries$) {
        this.firestore.entries$.subscribe((entries) => {
          this.entries = this.filterDuplicatesByProperty(this.sortByDate(entries), 'id');
        })
      }
      if(!this.user){
        this.entries = undefined;
        console.log(this.entries)
      }
    });
  }

  ngOnDestroy(): void {
    this.userSubscription$.unsubscribe();
  }

}
