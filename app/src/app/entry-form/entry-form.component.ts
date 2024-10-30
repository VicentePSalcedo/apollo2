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
    this.entry = this.fb.group({
      id: [],
      timeStamp: [],
      date: [Validators.required],
      lotNo: [Validators.required],
      address: ['', Validators.required],
      boardType: [],
      boards: [0],
      repairsOrWarranty: ['no'],
      repairBoards: [0],
      observations: [],
      image: [],
      workers: [],
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
    this.entry.reset({
      id: this.entry.value.id,
      timeStamp: this.entry.value.timeStamp,
      date: this.entry.value.date,
      lotNo: this.entry.value.lotNo,
      address: this.entry.value.address,
      boardType: this.entry.value.boardType,
      boards: this.entry.value.boards,
      repairsOrWarranty: this.entry.value.repairsOrWarranty,
      repairBoards: this.entry.value.repairBoards,
      observations: this.entry.value.observations,
      image: [],
      workers: this.entry.value.workers,
    })
  }

  clear(){
    this.entry.reset({
      id: "",
      date: this.entry.value.date,
      boards: [0],
      repairsOrWarranty: ['no'],
      repairBoards: [0],
    });
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
      let workType;
      let repairsOrWarranty;
      if(entry.smoothB1 > 0) workType = "B1 Liso";
      if(entry.smoothB2 > 0) workType = "B2 Liso";
      if(entry.smoothHoQa > 0) workType = "HO/QA smo";
      if(entry.textureB1 > 0) workType = "B1 text";
      if(entry.textureB2 > 0) workType = "B2 text";
      if(entry.textureHoQa > 0) workType = "HO/QA";
      if(entry.repairsOrWarranty > 0) repairsOrWarranty = "yes";
      this.entry.reset({
        id: entry.id,
        timeStamp: entry.timeStamp,
        date: entry.date,
        lotNo: entry.lotNo,
        address: entry.address,
        boardType: workType,
        boards: entry.boards,
        repairsOrWarranty: repairsOrWarranty,
        repairBoards: entry.repairsOrWarranty,
        observations: entry.observations,
        image: entry.image,
        workers: entry.workers,
      })
      if(entry.repairsOrWarranty > 0){
        this.entry.value.repairBoards = entry.repairsOrWarranty;
      }
    });
  }

  ngOnDestroy(): void {
    this.editEntrySub$?.unsubscribe();
    this._userSubscription$.unsubscribe();
  }

}
