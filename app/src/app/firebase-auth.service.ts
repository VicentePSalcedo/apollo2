import { Injectable, inject } from '@angular/core';
import { Auth, User, user, GoogleAuthProvider, signOut, signInWithPopup } from '@angular/fire/auth';
import { Subscription } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class FirebaseAuthService {
  private provider = new GoogleAuthProvider;
  private auth: Auth = inject(Auth);
  user$ = user(this.auth);
  userSub: Subscription;

  login (){
    return signInWithPopup(this.auth, this.provider);
  }
  logout (){
    return signOut(this.auth);
  }
  constructor() {
    //this.userSub = this.user$.subscribe((data: User | null) => {
    //  console.log(data);
    //})
    this.userSub = this.user$.subscribe();
  }
}
