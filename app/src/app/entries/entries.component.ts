import { Component, OnDestroy, OnInit } from '@angular/core';
import { Entry } from '../entry';
import { User } from 'firebase/auth';
import { FirebaseAuthService } from '../services/firebase-auth.service';
import { CloudStorageService } from '../services/cloud-storage.service';
import { Subscription } from 'rxjs';
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
  private userSub$?: Subscription;
  private user!: User | null;

  private entriesSub$?: Subscription;
  private smoothB1Total$?: Subscription;
  private smoothB2Total$?: Subscription;
  private smoothHoQaTotal$?: Subscription;
  private textureB1Total$?: Subscription;
  private textureB2Total$?: Subscription;
  private textureHoQa$?: Subscription;
  private repairsOrWarranty$?: Subscription;
  private grandTotal$?: Subscription;

  entriesDisplayed: Entry[] = [];
  smoothB1Total: number = 0;
  smoothB2Total: number = 0;
  smoothHoQaTotal: number = 0;
  textureB1Total: number = 0;
  textureB2Total: number = 0;
  textureHoQa: number = 0;
  repairsOrWarranty: number = 0;
  grandTotal: number = 0;

  constructor(
    private userAuth: FirebaseAuthService,
    private cloudStorage: CloudStorageService,
    private EntriesDataService: EntriesDataService,
    private firestore: FirestoreService
  ){
    // ------
    // This is in the constructor instead of ngOnInit to ensure it is populated
    // on routing to differnt pages withing the app
    // this.entriesDisplayed = this.EntriesDataService.getEntries();
    // ------
  }

  deleteEntry(input: string){
    this.firestore.delectEntry(input);
  }

  openFile(input: string){
    this.cloudStorage.openFile(input);
  }

  getFileNameFromUrl(fileUrl: string): string {
    if(this.user){
      return fileUrl.replace(this.user.uid + "/", "");
    }
    return 'none'
  }

  filterDisplayedEntriesByDateRange(startDate: Date, endDate: Date)  {
    this.EntriesDataService.filterDisplayedEntriesByDateRange(startDate, endDate);
  }

  ngOnInit(): void {
    this.entriesSub$ = this.EntriesDataService.entriesDisplayed.subscribe((value: Entry[]) => { this.entriesDisplayed = value; });
    this.smoothB1Total$ = this.EntriesDataService.smoothB1Total.subscribe((value: number) => { this.smoothB1Total = value; });
    this.smoothB2Total$ = this.EntriesDataService.smoothB2Total.subscribe((value: number) => { this.smoothB2Total = value; });
    this.smoothHoQaTotal$ = this.EntriesDataService.smoothHoQaTotal.subscribe((value: number) => { this.smoothHoQaTotal = value;  });
    this.textureB1Total$ = this.EntriesDataService.textureB1Total.subscribe((value: number) => { this.textureB1Total = value; });
    this.textureB2Total$ = this.EntriesDataService.textureB2Total.subscribe((value: number) => { this.textureB2Total = value; });
    this.textureHoQa$ = this.EntriesDataService.textureHoQa.subscribe((value: number) => { this.textureHoQa = value; });
    this.repairsOrWarranty$ = this.EntriesDataService.repairsOrWarranty.subscribe((value: number) => { this.repairsOrWarranty = value; });
    this.grandTotal$ = this.EntriesDataService.grandTotal.subscribe((value: number) => { this.grandTotal = value; });
    this.userSub$ = this.userAuth.user$.subscribe((data: User | null) => { this.user = data; });
  }

  ngOnDestroy(): void {
    this.entriesSub$?.unsubscribe();
    this.smoothB1Total$?.unsubscribe();
    this.smoothB2Total$?.unsubscribe();
    this.smoothHoQaTotal$?.unsubscribe();
    this.textureB1Total$?.unsubscribe();
    this.textureB2Total$?.unsubscribe();
    this.textureHoQa$?.unsubscribe();
    this.repairsOrWarranty$?.unsubscribe();
    this.grandTotal$?.unsubscribe();
    this.userSub$?.unsubscribe();
  }

}
