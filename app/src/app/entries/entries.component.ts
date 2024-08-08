import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../firestore.service';
import { Entry } from '../entry';
import { User } from 'firebase/auth';
import { FirebaseAuthService } from '../firebase-auth.service';
import { CloudStorageService } from '../cloud-storage.service';
import { skip } from 'rxjs';

@Component({
  selector: 'app-entries',
  standalone: true,
  imports: [],
  templateUrl: './entries.component.html',
  styleUrl: './entries.component.css'
})
export class EntriesComponent implements OnInit {

  entries: Entry[] = [];
  user!: User | null;

  constructor(
    private userAuth: FirebaseAuthService,
    private firestore: FirestoreService,
    private cloudStorage: CloudStorageService,
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
    this.firestore.entries$.pipe(skip(1)).subscribe((value: Entry[]) => {
      this.entries = value;
      console.log(this.entries);
    });
    this.userAuth.user$.subscribe((data: User | null) => {
      this.user = data;
    })
  }

}
