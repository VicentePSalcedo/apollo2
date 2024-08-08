import { Component, OnDestroy, OnInit } from '@angular/core';
import { Entry } from '../entry';
import { User } from 'firebase/auth';
import { FirebaseAuthService } from '../services/firebase-auth.service';
import { CloudStorageService } from '../services/cloud-storage.service';
import { skip } from 'rxjs';
import { EntriesDataService } from '../services/entries-data.service';

@Component({
  selector: 'app-entries',
  standalone: true,
  imports: [],
  templateUrl: './entries.component.html',
  styleUrl: './entries.component.css'
})
export class EntriesComponent implements OnInit, OnDestroy {

  entries: Entry[] = [];
  user!: User | null;

  constructor(
    private userAuth: FirebaseAuthService,
    private cloudStorage: CloudStorageService,
    private EntriesDataService: EntriesDataService
  ){
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

  ngOnInit(): void {
    this.EntriesDataService.entriesData.pipe(skip(1)).subscribe((value: Entry[]) => {
      this.entries = value;
      console.log(this.entries);
    });
    this.userAuth.user$.subscribe((data: User | null) => {
      this.user = data;
    });
  }
  ngOnDestroy(): void {
  }

}
