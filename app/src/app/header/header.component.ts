import { Component, OnDestroy, OnInit } from '@angular/core';
import { FirebaseAuthService } from '../firebase-auth.service';
import { Subscription } from 'rxjs';
import { User } from 'firebase/auth';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, OnDestroy {
  private userSubscription$!: Subscription;
  user!: User | null;

  constructor(private userAuth: FirebaseAuthService) {}

  login() {
    this.userAuth.login();
  }

  logout() {
    this.userAuth.logout();
  }

  ngOnInit(): void {
    this.userSubscription$ = this.userAuth.user$.subscribe((data: User | null)=> {
      this.user = data;
    })
  }

  ngOnDestroy(): void {
    this.userSubscription$.unsubscribe();
  }
}
