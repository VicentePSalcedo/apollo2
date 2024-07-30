import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReactiveFormsModule, Validators, FormBuilder, FormGroup } from '@angular/forms'
import { Subscription } from 'rxjs';
import { User } from 'firebase/auth';
import { FirebaseAuthService } from '../firebase-auth.service';
import { FirestoreService } from '../firestore.service';
import { EntriesComponent } from '../entries/entries.component';

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
  private _userSubscription$!: Subscription;

  constructor(
    private fb: FormBuilder,
    private userAuth: FirebaseAuthService,
    private firestore: FirestoreService
  ){
    this.entry = this.fb.group({
      date: [Validators.required],
      lotNo: [
        Validators.required,
        Validators.pattern("^[0-9]*$")
      ],
      address: ['', Validators.required],
      boards: [0],
      boardType: [''],
      repairsOrWarranty: [0],
      observations: [''],
      image: [''],
    })
  }
  onSubmit() {
    let date: String = this.entry.value.date;
    let lotNo: Number = this.entry.value.lotNo;
    let address: String = this.entry.value.address;
    let boards: Number = this.entry.value.boards;
    let smoothB1: Number = 0;
    let smoothB2: Number = 0;
    let textureB1: Number = 0;
    let textureB2: Number = 0;
    let textureHoQa: Number = 0;
    let repairsOrWarranty: Number= this.entry.value.repairsOrWarranty;
    let observations: String = this.entry.value.observations;
    let image: String = this.entry.value.image;
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
