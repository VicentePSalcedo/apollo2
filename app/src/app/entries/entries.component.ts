import { Component, OnDestroy, OnInit } from '@angular/core';
import { Entry } from '../entry';
import { User } from 'firebase/auth';
import { FirebaseAuthService } from '../services/firebase-auth.service';
import { CloudStorageService } from '../services/cloud-storage.service';
import { skip, Subscription } from 'rxjs';
import { EntriesDataService } from '../services/entries-data.service';

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
  private today: Date;
  private thirtyDaysAgo: Date;
  private user!: User | null;

  entries: Entry[];
  entriesDisplayed: Entry[];

  constructor(
    private userAuth: FirebaseAuthService,
    private cloudStorage: CloudStorageService,
    private EntriesDataService: EntriesDataService
  ){
    let { today, thirtyDaysAgo } = this.getTodaysAndPrevious30Days();
    this.today = today;
    this.thirtyDaysAgo = thirtyDaysAgo;
    this.entries = this.EntriesDataService.getEntries();
    this.entriesDisplayed = this.entries;
    this.filterByDateRange(this.entries, thirtyDaysAgo, today);
  }

  getTodaysAndPrevious30Days(): { today: Date; thirtyDaysAgo: Date } {
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);
    return { today, thirtyDaysAgo };
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

  filterByDateRange(data: Entry[], startDate: Date, endDate: Date)  {
    this.entriesDisplayed = data.filter(item => {
      const itemDate = new Date(item.date); // Ensure item.date is a Date object
      return itemDate >= startDate && itemDate <= endDate;
    });
  }

  ngOnInit(): void {
    this.entriesSub$ = this.EntriesDataService.entriesData.pipe(skip(1)).subscribe((value: Entry[]) => {
      this.entries = value;
      this.filterByDateRange(this.entries, this.thirtyDaysAgo, this.today);
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
