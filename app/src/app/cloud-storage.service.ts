import { inject, Injectable } from '@angular/core';
import { ref, Storage, uploadBytesResumable } from '@angular/fire/storage';
import { FirebaseAuthService } from './firebase-auth.service';
import { User } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class CloudStorageService {
  private readonly storage: Storage = inject(Storage);
  user!: User | null;

  constructor(private userAuth: FirebaseAuthService) {
    this.userAuth.user$.subscribe((data: User) => {
      this.user = data;
    })
  }

  uploadFile(input: HTMLInputElement) {
    if(!input.files || !this.user) return;
    let files: FileList = input.files;

    for(let i = 0; i < files.length; i++) {
      let file = files.item(i);
      if (file) {
        let storageRef = ref(this.storage, this.user.uid + "/" + file.name);
        uploadBytesResumable(storageRef, file);
      }
    }
  }
}
