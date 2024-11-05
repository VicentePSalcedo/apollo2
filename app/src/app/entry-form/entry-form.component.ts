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
    private cloudStorage: CloudStorageService,
    private editEntryService: EditEntryService,
  ){
    this.currentEntry = this.editEntryService.currentEntry.getValue();
    this.currentEntryWorkType = this.getCurrentEntryWorkType(this.currentEntry)
    if(this.currentEntry.repairsOrWarranty > 0) {
      this.currentEntryRepairsOrWarranty = "yes";
    } else {
      this.currentEntryRepairsOrWarranty = "";
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

  removeImageFromEntry(imageToRemove: String, entry: Entry){
    const imageArray: String[] = [imageToRemove];
    entry.image = entry.image.filter(image => image !== imageToRemove);
    this.firestore.editEntry(entry);
    this.cloudStorage.deleteFiles(imageArray);
  }

  onSubmit(input: HTMLInputElement) {
    if(!this.user) return;
    let newEntry: Entry = this.createEntry(input);
    this.firestore.addEntry(newEntry);
    this.cloudStorage.uploadFile(input, newEntry.id);
    this.clear();
  }

  onEdit(input: HTMLInputElement){
    if(!this.user) return;
    let updatedEntry: Entry = this.editEntryService.currentEntry.getValue();
    if(this.entry.value.date){
      updatedEntry.date = this.entry.value.date;
    }
    if(this.entry.value.lotNo){
      updatedEntry.lotNo = this.entry.value.lotNo;
    }
    if(this.entry.value.address){
      updatedEntry.address = this.entry.value.address;
    }
    if(this.entry.value.boards){
      updatedEntry.boards = this.entry.value.boards;
      updatedEntry = this.updateEntryBoardsByType(updatedEntry, this.currentEntryWorkType);
    }
    if(this.entry.value.boardType){
      updatedEntry = this.updateEntryBoardsByType(updatedEntry, this.entry.value.boardType);
    }
    if(this.entry.value.repairBoards && (this.currentEntry.repairsOrWarranty > 0 || this.entry.value.repairsOrWarranty == "yes")){
      updatedEntry.repairsOrWarranty = this.entry.value.repairBoards;
    }
    if (this.entry.value.repairsOrWarranty == "no"){
      updatedEntry.repairsOrWarranty = 0;
    }
    if(this.entry.value.observations){
      updatedEntry.observations = this.entry.value.observations;
    }
    if(this.entry.value.workers){
      updatedEntry.workers = this.entry.value.workers;
    }
    if(input.files){
      let files: FileList = input.files;
      for(let i = 0; i < files.length; i++) {
        let file = files.item(i);
        if (file && !updatedEntry.image.includes(this.user!.uid + "/" + updatedEntry.id + "/" + file.name)) {
          updatedEntry.image.push(this.user!.uid + "/" + updatedEntry.id + "/" + file.name);
        }
      }
    }
    this.firestore.editEntry(updatedEntry);
    this.cloudStorage.uploadFile(input, updatedEntry.id);
    this.clear();
  }

  onDelete(){
    this.firestore.deletEntry(this.currentEntry.id);
    this.cloudStorage.deleteFiles(this.currentEntry.image);
    this.clear();
  }

  createEntry(input: HTMLInputElement): Entry{
    let entry: Entry = this.editEntryService.newEntry();
    let now = new Date();
    let timeStamp = now.getTime()
    let ttl = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
    entry.id = objectHash(this.entry.value.date + this.entry.value.lotNo.toString() + this.entry.value.address.trim() + this.entry.value.boards + this.entry.value.boardType + this.entry.value.repairBoards + this.entry.value.observations + this.entry.value.image + this.entry.value.workers)
    entry.timeStamp = timeStamp;
    entry.date = this.entry.value.date;
    entry.lotNo = this.entry.value.lotNo;
    entry.address = this.entry.value.address.trim();
    entry.boards = this.entry.value.boards;
    entry = this.updateEntryBoardsByType(entry, this.entry.value.boardType);
    if (this.entry.value.repairsOrWarranty == 'yes') {
      entry.repairsOrWarranty = this.entry.value.repairBoards;
    }
    entry.observations = this.entry.value.observations;
    if(input.files){
      let files: FileList = input.files;

      for(let i = 0; i < files.length; i++) {
        let file = files.item(i);
        if (file) {
          entry.image.push(this.user!.uid + "/" + entry.id + "/" + file.name);
        }
      }
    }
    entry.workers = this.entry.value.workers;
    entry.ttl = Timestamp.fromDate(ttl);
    return entry;
  }

  clear(){
    this.editEntryService.currentEntry.next(this.editEntryService.newEntry());
    this.entry.reset();
    console.log(this.currentEntry);
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

  updateEntryBoardsByType(entry: Entry, workType: String): Entry {
    entry.smoothB1 = 0;
    entry.smoothB2 = 0;
    entry.smoothHoQa = 0;
    entry.textureB1 = 0;
    entry.textureB2 = 0;
    entry.textureHoQa = 0;
    if (workType == 'B1 Liso') {
      entry.smoothB1 = entry.boards * 1.25;
    } else if (workType == 'B2 Liso') {
      entry.smoothB2 = entry.boards * 0.75;
    } else if (workType == 'HO/QA smo') {
      entry.smoothHoQa = entry.boards * 0.45;
    } else if (workType == 'B1 text') {
      entry.textureB1 = entry.boards * 0.5;
    } else if (workType == 'B2 text') {
      entry.textureB2 = entry.boards * 0.3;
    } else if (workType == 'HO/QA') {
      entry.textureHoQa = entry.boards * 0.2;
    }
    return entry;
  }

  getCurrentEntryWorkType(entry: Entry): String{
    if (entry.smoothB1 > 0){
      return "B1 Liso";
    } else if(entry.smoothB2 > 0) {
      return "B2 Liso";
    } else if(entry.smoothHoQa > 0) {
      return "HO/QA smo";
    } else if(entry.textureB1 > 0) {
      return "B1 text";
    } else if(entry.textureB2 > 0) {
      return "B2 text";
    } else if(entry.textureHoQa > 0) {
      return "HO/QA";
    } else {
      return "";
    }
  }

  getFileNameFromUrl(fileUrl: string, entryId: string): string {
    if(this.user){
      let fileUrlWithoutUserId = fileUrl.replace(this.user.uid + "/", "");
      return fileUrlWithoutUserId.replace(entryId + "/", "");
    }
    return 'none'
  }

  openFile(input: string){
    this.cloudStorage.openFile(input);
  }

  ngOnInit(): void {
    this._userSubscription$ = this.userAuth.user$.subscribe((data: User | null) => {
      this.user = data;
    });
    this.editEntrySub$ = this.editEntryService.currentEntry.subscribe((entry: Entry) =>{
      this.currentEntry = entry;
      this.currentEntryWorkType = this.getCurrentEntryWorkType(entry);
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
