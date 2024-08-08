import { Routes } from '@angular/router';
import { EntryFormComponent } from './entry-form/entry-form.component';
import { ExportEntriesComponent } from './export-entries/export-entries.component';

export const routes: Routes = [
  {
    path: '',
    component: EntryFormComponent
  },
  {
    path: 'export',
    component: ExportEntriesComponent
  }
];
