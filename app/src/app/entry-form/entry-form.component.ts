import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReactiveFormsModule, Validators, FormBuilder, FormGroup } from '@angular/forms'
import { Subscription } from 'rxjs';
import { FirebaseAuthService } from '../firebase-auth.service';
import { User } from 'firebase/auth';

@Component({
  selector: 'app-entry-form',
  standalone: true,
  templateUrl: './entry-form.component.html',
  styleUrl: './entry-form.component.css',
  imports: [ReactiveFormsModule]
})
export class EntryFormComponent implements OnInit, OnDestroy {
  entry: FormGroup;
  user!: User | null;
  private _userSubscription$!: Subscription;

  constructor(private fb: FormBuilder, private userAuth: FirebaseAuthService) {
    this.entry = this.fb.group({
      date: [Validators.required],
      lotNumb: [Validators.required],
      address: ['', Validators.required],
      boards: [''],
      boardType: [''],
      repairsOrWarranty: [''],
      observations: [''],
      image: [''],
    })
  }

  onSubmit() {
    if(!this.user){
      console.warn("please login");
      return
    }
    console.log(this.entry.value);
    console.log(this.user.uid);
  }

  ngOnInit(): void {
    this._userSubscription$ = this.userAuth.user$.subscribe((data: User | null)=> {
      this.user = data;
    })
  }

  ngOnDestroy(): void {
    this._userSubscription$.unsubscribe();
  }
}
