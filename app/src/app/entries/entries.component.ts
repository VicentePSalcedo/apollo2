import { Component, OnDestroy, OnInit } from '@angular/core';
import { Entry } from '../entry';
import { User } from 'firebase/auth';
import { FirebaseAuthService } from '../services/firebase-auth.service';
import { CloudStorageService } from '../services/cloud-storage.service';
import { skip, Subscription } from 'rxjs';
import { EntriesDataService } from '../services/entries-data.service';
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-entries',
  standalone: true,
  imports: [],
  templateUrl: './entries.component.html',
  styleUrl: './entries.component.css'
})
export class EntriesComponent implements OnInit, OnDestroy {
  private entriesSub$?: Subscription;
  private userSub$?: Subscription;
  private user!: User | null;

  entries: Entry[];
  entriesDisplayed: Entry[];
  smoothB1Total: number = 0;
  smoothB2Total: number = 0;
  textureB1Total: number = 0;
  textureB2Total: number = 0;
  textureB2HoQa: number = 0;
  repairsOrWarranty: number = 0;
  grandTotal: number = 0;

  constructor(
    private userAuth: FirebaseAuthService,
    private cloudStorage: CloudStorageService,
    private EntriesDataService: EntriesDataService,
    private firestore: FirestoreService
  ){
    this.entries = this.EntriesDataService.getEntries();
    // ------
    // This is in the constructor instead of ngOnInit to ensure it is populated
    // and limited to the last 30 days on routing to differnt pages withing the
    // app
    this.entriesDisplayed = this.entries;
    // ------
    this.calculateTotals();
  }

  deleteEntry(input: string){
    this.firestore.delectEntry(input);
  }

  calculateTotals() {
    this.smoothB1Total = 0;
    this.smoothB2Total = 0;
    this.textureB1Total = 0;
    this.textureB2Total = 0;
    this.textureB2HoQa = 0;
    this.repairsOrWarranty = 0;
    this.repairsOrWarranty = 0;
    this.grandTotal = 0;
    this.entriesDisplayed.forEach(entry => {
      this.smoothB1Total = this.smoothB1Total + entry.smoothB1;
      this.smoothB2Total = this.smoothB2Total + entry.smoothB2;
      this.textureB1Total = this.textureB1Total + entry.textureB1;
      this.textureB2Total = this.textureB2Total + entry.textureB2;
      this.textureB2HoQa = this.textureB2HoQa + entry.textureHoQa;
      this.repairsOrWarranty = this.repairsOrWarranty + entry.repairsOrWarranty;
    })
    this.grandTotal = this.smoothB1Total + this.smoothB2Total + this.textureB1Total
      + this.textureB2Total + this.textureB2HoQa + this.repairsOrWarranty;
  }

  downloadFile(input: string){
    this.cloudStorage.downloadFile(input);
  }

  getFileNameFromUrl(fileUrl: string): string {
    if(this.user){
      return fileUrl.replace(this.user.uid + "/", "");
    }
    return 'none'
  }

  filterDisplayedEntriesByDateRange(data: Entry[], startDate: Date, endDate: Date)  {
    this.entriesDisplayed = data.filter(item => {
      const itemDate = new Date(item.date); // Ensure item.date is a Date object
      return itemDate >= startDate && itemDate <= endDate;
    });
    this.calculateTotals();
  }

  ngOnInit(): void {
    this.entriesSub$ = this.EntriesDataService.entriesData.pipe(skip(1)).subscribe((value: Entry[]) => {
      this.entries = value;
      this.entriesDisplayed = this.entries;
      this.calculateTotals();
    });
    this.userSub$ = this.userAuth.user$.subscribe((data: User | null) => {
      this.user = data;
    });
  }

  ngOnDestroy(): void {
    this.entriesSub$?.unsubscribe();
    this.userSub$?.unsubscribe();
  }

}
