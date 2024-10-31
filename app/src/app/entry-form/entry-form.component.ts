import { Component, OnDestroy, OnInit } from '@angular/core';
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
import { CloudStorageService } from '../services/cloud-storage.service';
import { EditEntryService } from '../services/edit-entry.service';
import { Entry } from '../entry';
import objectHash from 'object-hash';
import { Timestamp } from '@angular/fire/firestore';

@Component({
  selector: 'app-entry-form',
  standalone: true,
  templateUrl: './entry-form.component.html',
  styleUrl: './entry-form.component.css',
  imports: [
    ReactiveFormsModule,
  ]
})
export class EntryFormComponent implements OnInit, OnDestroy {
  private editEntrySub$?: Subscription;
  currentEntry: Entry;
  currentEntryWorkType: String;
  currentEntryRepairsOrWarranty: String;

  private _userSubscription$!: Subscription;

  entry: FormGroup;
  user!: User | null;
  lastBoardCount: number = 0;

  constructor(
    private fb: FormBuilder,
    private userAuth: FirebaseAuthService,
    private firestore: FirestoreService,
    private cloadStorage: CloudStorageService,
    private editEntryService: EditEntryService,
  ){
    this.currentEntry = this.editEntryService.currentEntry.getValue();
    console.log(this.currentEntry);
    if(this.currentEntry.smoothB2 > 0) {
      this.currentEntryWorkType = "B2 Liso";
    } else if(this.currentEntry.smoothHoQa > 0) {
      this.currentEntryWorkType = "HO/QA smo";
    } else if(this.currentEntry.textureB1 > 0) {
      this.currentEntryWorkType = "B1 text";
    } else if(this.currentEntry.textureB2 > 0) {
      this.currentEntryWorkType = "B2 text";
    } else if(this.currentEntry.textureHoQa > 0) {
      this.currentEntryWorkType = "HO/QA";
    } else {
      this.currentEntryWorkType  = "B1 Liso";
    }
    if(this.currentEntry.repairsOrWarranty > 0) {
      this.currentEntryRepairsOrWarranty = "yes";
    } else {
      this.currentEntryRepairsOrWarranty = "no";
    }
    this.entry = this.fb.group({
      date: [this.currentEntry.date, Validators.required],
      lotNo: [this.currentEntry.lotNo, Validators.required],
      address: [this.currentEntry.address, Validators.required],
      boardType: [this.currentEntryWorkType],
      boards: [this.currentEntry.boards],
      repairsOrWarranty: [this.currentEntryRepairsOrWarranty],
      repairBoards: [this.currentEntry.repairsOrWarranty],
      observations: [this.currentEntry.observations],
      image: [this.currentEntry.image],
      workers: [this.currentEntry.workers],
    });
  }

  createEntry(input: HTMLInputElement): Entry{
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
    }

    if (this.entry.value.repairsOrWarranty == 'yes') {
      repairsOrWarranty = this.entry.value.repairBoards;
    }

    if(input.files){
      let files: FileList = input.files;

      for(let i = 0; i < files.length; i++) {
        let file = files.item(i);
        if (file) {
          image.push(this.user!.uid + "/" + file.name);
        }
      }
    }
    let id = objectHash(this.entry.value.date + this.entry.value.lotNo.toString() + this.entry.value.address.trim() + this.entry.value.boards.toString() + smoothB1.toString() + smoothB2.toString() + textureB1.toString() + textureB2.toString() + textureHoQa.toString() + repairsOrWarranty.toString() + this.entry.value.observations + image + this.entry.value.workers)
    let now = new Date();
    let timeStamp = now.getTime()
    let ttl = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
    let entry: Entry = {
        id: id,
        timeStamp: timeStamp,
        date: this.entry.value.date,
        lotNo: this.entry.value.lotNo,
        address: this.entry.value.address.trim(),
        boards: this.entry.value.boards,
        smoothB1: smoothB1,
        smoothB2: smoothB2,
        smoothHoQa: smoothHoQa,
        textureB1: textureB1,
        textureB2: textureB2,
        textureHoQa: textureHoQa,
        repairsOrWarranty: repairsOrWarranty,
        observations: this.entry.value.observations,
        image: image,
        workers: this.entry.value.workers,
        ttl: Timestamp.fromDate(ttl),
    };
    return entry;
  }

  clearImages(){
    this.entry.setValue({
      date: this.currentEntry.date,
      lotNo: this.currentEntry.lotNo,
      address: this.currentEntry.address,
      boardType: this.currentEntryWorkType,
      boards: this.currentEntry.boards,
      repairsOrWarranty: this.currentEntryRepairsOrWarranty,
      repairBoards: this.currentEntry.repairsOrWarranty,
      observations: this.currentEntry.observations,
      image: [],
      workers: this.currentEntry.workers,
    })
  }

  clear(){
    this.editEntryService.currentEntry.next(this.editEntryService.initialEntry);
  }

  onDelete(){
    this.firestore.deletEntry(this.entry.value.id);
    this.cloadStorage.deleteFiles(this.entry.value.image);
    this.clear();
  }

  onEdit(input: HTMLInputElement){
    if(!this.user) return;
    let updatedEntry: Entry = this.editEntryService.currentEntry.getValue();
    updatedEntry.smoothB1 = 0;
    updatedEntry.smoothB2 = 0;
    updatedEntry.smoothHoQa = 0;
    updatedEntry.textureB1 = 0;
    updatedEntry.textureB2 = 0;
    updatedEntry.textureHoQa = 0;
    updatedEntry.repairsOrWarranty = 0;
    if (this.entry.value.boardType == 'B1 Liso') {
      updatedEntry.smoothB1 = this.entry.value.boards * 1.25;
    } else if (this.entry.value.boardType == 'B2 Liso') {
      updatedEntry.smoothB2 = this.entry.value.boards * 0.75;
    } else if (this.entry.value.boardType == 'HO/QA smo') {
      updatedEntry.smoothHoQa = this.entry.value.boards * 0.45;
    } else if (this.entry.value.boardType == 'B1 text') {
      updatedEntry.textureB1 = this.entry.value.boards * 0.5;
    } else if (this.entry.value.boardType == 'B2 text') {
      updatedEntry.textureB2 = this.entry.value.boards * 0.3;
    } else if (this.entry.value.boardType == 'HO/QA') {
      updatedEntry.textureHoQa = this.entry.value.boards * 0.2;
    }

    if (this.entry.value.repairsOrWarranty == 'yes') {
      updatedEntry.repairsOrWarranty = this.entry.value.repairBoards;
    }

    if(input.files){
      let files: FileList = input.files;

      for(let i = 0; i < files.length; i++) {
        let file = files.item(i);
        if (file) {
          updatedEntry.image.push(this.user.uid + "/" + file.name);
        }
      }
    }
    this.firestore.editEntry(updatedEntry);
    this.cloadStorage.uploadFile(input);
    this.clear();
  }

  onSubmit(input: HTMLInputElement) {
    if(!this.user) return;
    let newEntry: Entry = this.createEntry(input);
    this.firestore.addEntry(newEntry);
    this.cloadStorage.uploadFile(input);
    this.clear();
  }

  ngOnInit(): void {
    this._userSubscription$ = this.userAuth.user$.subscribe((data: User | null) => {
      this.user = data;
    });
    this.editEntrySub$ = this.editEntryService.currentEntry.subscribe((entry: Entry) =>{
      this.currentEntry = entry;
      if(entry.smoothB2 > 0) {
        this.currentEntryWorkType = "B2 Liso";
      } else if(entry.smoothHoQa > 0) {
        this.currentEntryWorkType = "HO/QA smo";
      } else if(entry.textureB1 > 0) {
        this.currentEntryWorkType = "B1 text";
      } else if(entry.textureB2 > 0) {
        this.currentEntryWorkType = "B2 text";
      } else if(entry.textureHoQa > 0) {
        this.currentEntryWorkType = "HO/QA";
      } else {
        this.currentEntryWorkType  = "B1 Liso";
      }
      if(entry.repairsOrWarranty > 0) {
        this.currentEntryRepairsOrWarranty = "yes";
      } else {
        this.currentEntryRepairsOrWarranty = "no";
      }
    });
  }

  ngOnDestroy(): void {
    this.editEntrySub$?.unsubscribe();
    this._userSubscription$.unsubscribe();
  }

}
