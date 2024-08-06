import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  Validators,
  FormBuilder,
  FormGroup
} from '@angular/forms'
import { Subscription } from 'rxjs';
import { User } from 'firebase/auth';
import { FirebaseAuthService } from '../firebase-auth.service';
import { FirestoreService } from '../firestore.service';
import { EntriesComponent } from '../entries/entries.component';
import { CloudStorageService } from '../cloud-storage.service';

@Component({
  selector: 'app-entry-form',
  standalone: true,
  templateUrl: './entry-form.component.html',
  styleUrl: './entry-form.component.css',
  imports: [
    ReactiveFormsModule,
    EntriesComponent
  ]
})
export class EntryFormComponent implements OnInit, OnDestroy {
  entry: FormGroup;
  user!: User | null;
  todaysDate: String = this.getTodaysDateYYYYMMDD();
  private _userSubscription$!: Subscription;

  constructor(
    private fb: FormBuilder,
    private userAuth: FirebaseAuthService,
    private firestore: FirestoreService,
    private cloadStorage: CloudStorageService,
  ){
    this.entry = this.fb.group({
      date: [this.todaysDate, Validators.required],
      lotNo: ['', Validators.required],
      address: ['', Validators.required],
      boards: [0],
      boardType: ['none'],
      repairsOrWarranty: [0],
      observations: ['none'],
      image: ['none'],
    })
  }

  getTodaysDateYYYYMMDD(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  onSubmit(input: HTMLInputElement) {
    if(!input.files || !this.user) return;
    let smoothB1: Number = 0;
    let smoothB2: Number = 0;
    let textureB1: Number = 0;
    let textureB2: Number = 0;
    let textureHoQa: Number = 0;
    let image: String[] = [];

    let date: String = this.entry.value.date;
    let lotNo: Number = this.entry.value.lotNo;
    let address: String = this.entry.value.address;
    let boards: Number = this.entry.value.boards;

    if (this.entry.value.boardType == 'B1 Liso') {
      smoothB1 = this.entry.value.boards * 1.25;
    } else if (this.entry.value.boardType == 'B2 Liso') {
      smoothB2 = this.entry.value.boards * 0.75;
    } else if (this.entry.value.boardType == 'HO/QA smo') {
      textureHoQa = this.entry.value.boards * 0.45;
    } else if (this.entry.value.boardType == 'B1 text') {
      textureB1 = this.entry.value.boards * 0.5;
    } else if (this.entry.value.boardType == 'B2 text') {
      textureB2 = this.entry.value.boards * 0.3;
    } else if (this.entry.value.boardType == 'HO/QA') {
      textureHoQa = this.entry.value.boards * 0.2;
    }

    let repairsOrWarranty: Number= this.entry.value.repairsOrWarranty;
    let observations: String = this.entry.value.observations;

    let files: FileList = input.files;
    for(let i = 0; i < files.length; i++) {
      let file = files.item(i);
      if (file) {
        image.push(this.user.uid + "/" + file.name);
      }
    }

    this.firestore.addEntry(
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
    );
    this.cloadStorage.uploadFile(input);
  }
  ngOnInit(): void {
    this._userSubscription$ = this.userAuth.user$.subscribe((data: User | null) => {
      this.user = data;
    })
  }

  ngOnDestroy(): void {
    this._userSubscription$.unsubscribe();
  }

}
