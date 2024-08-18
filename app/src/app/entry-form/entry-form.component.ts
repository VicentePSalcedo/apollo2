import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  ReactiveFormsModule,
  Validators,
  FormBuilder,
  FormGroup
} from '@angular/forms'
import { Subscription } from 'rxjs';
import { User } from 'firebase/auth';
import { FirebaseAuthService } from '../services/firebase-auth.service';
import { FirestoreService } from '../services/firestore.service';
import { EntriesComponent } from '../entries/entries.component';
import { CloudStorageService } from '../services/cloud-storage.service';
import { EntriesDataService } from '../services/entries-data.service';

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
  @ViewChild(EntriesComponent) child?: EntriesComponent;

  private _userSubscription$!: Subscription;

  entry: FormGroup;
  user!: User | null;

  constructor(
    private fb: FormBuilder,
    private userAuth: FirebaseAuthService,
    private firestore: FirestoreService,
    private cloadStorage: CloudStorageService,
    private entries: EntriesDataService
  ){
    this.entry = this.fb.group({
      date: [Validators.required],
      lotNo: [Validators.required],
      address: ['', Validators.required],
      boards: [0, Validators.required],
      boardType: [Validators.required],
      observations: [],
      image: [],
      workers: [],
    });
  }

  getLastCount(){
    this.entry.value.boards = this.entries.getMostRecentBoardCount(this.entry.value.lotNo, this.entry.value.address);
    console.log(this.entries.getMostRecentBoardCount(this.entry.value.lotNo, this.entry.value.address));
  }

  clearImageSelection(){
    this.entry.reset();
  }

  onSubmit(input: HTMLInputElement) {
    if(!this.user) return;
    let smoothB1: number = 0;
    let smoothB2: number = 0;
    let smoothHoQa: number = 0;
    let textureB1: number = 0;
    let textureB2: number = 0;
    let textureHoQa: number = 0;
    let repairsOrWarranty: number = 0;
    let image: string[] = [];
    if (this.entry.value.boardType == 'B1 Liso') {
      smoothB1 = this.entry.value.boards * 1.25;
    } else if (this.entry.value.boardType == 'B2 Liso') {
      smoothB2 = this.entry.value.boards * 0.75;
    } else if (this.entry.value.boardType == 'HO/QA smo') {
      smoothHoQa = this.entry.value.boards * 0.45;
    } else if (this.entry.value.boardType == 'B1 text') {
      textureB1 = this.entry.value.boards * 0.5;
    } else if (this.entry.value.boardType == 'B2 text') {
      textureB2 = this.entry.value.boards * 0.3;
    } else if (this.entry.value.boardType == 'HO/QA') {
      textureHoQa = this.entry.value.boards * 0.2;
    } else if (this.entry.value.boardType == 'repairsOrWarranty') {
      repairsOrWarranty = this.entry.value.boards;
      this.entry.value.boards = 0;
    }

    if(input.files){
      let files: FileList = input.files;

      for(let i = 0; i < files.length; i++) {
        let file = files.item(i);
        if (file) {
          image.push(this.user.uid + "/" + file.name);
        }
      }
    }

    this.firestore.addEntry(
      this.entry.value.date,
      this.entry.value.lotNo,
      this.entry.value.address.trim(),
      this.entry.value.boards,
      smoothB1,
      smoothB2,
      smoothHoQa,
      textureB1,
      textureB2,
      textureHoQa,
      repairsOrWarranty,
      this.entry.value.observations,
      image,
      this.entry.value.workers
    );

    this.cloadStorage.uploadFile(input);
  }

  ngOnInit(): void {
    this._userSubscription$ = this.userAuth.user$.subscribe(
      (data: User | null) => {
      this.user = data;
    })
  }

  ngOnDestroy(): void {
    this._userSubscription$.unsubscribe();
  }

}
