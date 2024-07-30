import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../firestore.service';
import { Entry } from '../entry';

@Component({
  selector: 'app-entries',
  standalone: true,
  imports: [],
  templateUrl: './entries.component.html',
  styleUrl: './entries.component.css'
})
export class EntriesComponent implements OnInit {
  entries!: Entry[];
  constructor(private firestore: FirestoreService){
    this.firestore.entries$?.subscribe((entries) => {
      this.entries = entries;
      console.log(this.entries);
    });
  }
  ngOnInit(): void {
  }
}
