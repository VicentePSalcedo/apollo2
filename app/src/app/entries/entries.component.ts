import { Component, OnDestroy, OnInit } from '@angular/core';
import { Entry } from '../entry';
import { User } from 'firebase/auth';
import { FirebaseAuthService } from '../services/firebase-auth.service';
import { CloudStorageService } from '../services/cloud-storage.service';
import { Subscription } from 'rxjs';
import { EntriesDataService } from '../services/entries-data.service';
import { RouterLink } from '@angular/router';
import { EditEntryService } from '../services/edit-entry.service';

@Component({
  selector: 'app-entries',
  standalone: true,
  imports: [
    RouterLink
  ],
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
  private textureHoQaTotal$?: Subscription;
  private repairsOrWarrantyTotal$?: Subscription;
  private grandTotal$?: Subscription;

  entriesDisplayed: Entry[];
  smoothB1Total: number = 0;
  smoothB2Total: number = 0;
  smoothHoQaTotal: number = 0;
  textureB1Total: number = 0;
  textureB2Total: number = 0;
  textureHoQaTotal: number = 0;
  repairsOrWarrantyTotal: number = 0;
  grandTotal: number = 0;

  constructor(
    private userAuth: FirebaseAuthService,
    private cloudStorage: CloudStorageService,
    private entriesDataService: EntriesDataService,
    private editEntryService: EditEntryService,
  ){
    this.entriesDisplayed = this.entriesDataService.entriesDisplayed.getValue();
  }

  openEdit(entry: Entry) {
    this.editEntryService.currentEntry.next(entry);
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

  ngOnInit(): void {
    this.entriesSub$ = this.entriesDataService.entriesDisplayed.subscribe((value: Entry[])=>{
      this.entriesDisplayed = value;
    });
    this.smoothB1Total$ = this.entriesDataService.smoothB1Total.subscribe((value: number)=>{
      this.smoothB1Total = value;
    });
    this.smoothB2Total$ = this.entriesDataService.smoothB2Total.subscribe((value: number)=>{
      this.smoothB2Total = value;
    });
    this.smoothHoQaTotal$ = this.entriesDataService.smoothHoQaTotal.subscribe((value: number)=>{
      this.smoothHoQaTotal = value;
    });
    this.textureB1Total$ = this.entriesDataService.textureB1Total.subscribe((value: number)=>{
      this.textureB1Total = value;
    });
    this.textureB2Total$ = this.entriesDataService.textureB2Total.subscribe((value: number)=>{
      this.textureB2Total = value;
    });
    this.textureHoQaTotal$ = this.entriesDataService.textureHoQaTotal.subscribe((value: number)=>{
      this.textureHoQaTotal = value;
    });
    this.repairsOrWarrantyTotal$ = this.entriesDataService.repairsOrWarrantyTotal.subscribe((value: number)=>{
      this.repairsOrWarrantyTotal = value;
    });
    this.grandTotal$ = this.entriesDataService.grandTotal.subscribe((value: number)=>{
      this.grandTotal = value;
    });
    this.userSub$ = this.userAuth.user$.subscribe((data: User | null)=>{
      this.user = data;
    });
  }

  ngOnDestroy(): void {
    this.entriesSub$?.unsubscribe();
    this.smoothB1Total$?.unsubscribe();
    this.smoothB2Total$?.unsubscribe();
    this.smoothHoQaTotal$?.unsubscribe();
    this.textureB1Total$?.unsubscribe();
    this.textureB2Total$?.unsubscribe();
    this.textureHoQaTotal$?.unsubscribe();
    this.repairsOrWarrantyTotal$?.unsubscribe();
    this.grandTotal$?.unsubscribe();
    this.userSub$?.unsubscribe();
  }

}
