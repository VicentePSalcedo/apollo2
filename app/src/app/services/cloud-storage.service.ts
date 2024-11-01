import { inject, Injectable } from '@angular/core';
import { ref, Storage, getDownloadURL, uploadBytesResumable, deleteObject } from '@angular/fire/storage';
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

  deleteFiles(images: String[]) {
    if(!this.user) return;
    for(let i = 0; i < images.length; i++) {
      let storageRef = ref(this.storage, "Users/" + images[i]);
      deleteObject(storageRef).then(() => {
        console.log(images[i] + " deleted succesfully");
      }).catch((error) => {
        console.log(error);
      });
    }
  }

  uploadFile(input: HTMLInputElement, entryId: String) {
    if(!input.files || !this.user) return;
    let files: FileList = input.files;

    for(let i = 0; i < files.length; i++) {
      let file = files.item(i);
      if (file) {
        let storageRef = ref(this.storage, "Users/" + this.user.uid + "/" + entryId + "/" + file.name);
        uploadBytesResumable(storageRef, file);
      }
    }
  }

  async getFileUrl(input: string): Promise<string>{
    return getDownloadURL(ref(this.storage, "Users/" + input));
  }

  openFile(input: string) {
    getDownloadURL(ref(this.storage, "Users/" + input))
      .then((url) => {
        const xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        xhr.onload = () => {
          const blob = xhr.response;
          let blobUrl = URL.createObjectURL(blob);
          window.location.assign(blobUrl);
        };
        xhr.open('GET', url);
        xhr.send();
      })
      .catch((error) => {
        console.log(error);
    });
  }
}
