import { Component, } from '@angular/core';
import { ReactiveFormsModule, Validators, FormBuilder, FormGroup } from '@angular/forms'

@Component({
  selector: 'app-entry-form',
  standalone: true,
  templateUrl: './entry-form.component.html',
  styleUrl: './entry-form.component.css',
  imports: [ReactiveFormsModule]
})
export class EntryFormComponent {
  entry: FormGroup;
  onSubmit() {
    console.log(this.entry.value);
  }

  constructor(private fb: FormBuilder) {
      this.entry = this.fb.group({
        date: [Validators.required],
        lotNumb: [Validators.required],
        address: ['', Validators.required],
        boards: [],
        boardType: [],
        repairsOrWarranty: [],
        observations: [],
        image: [],
      })
  }
}
