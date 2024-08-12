import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { getApp, initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { provideAppCheck, initializeAppCheck, ReCaptchaV3Provider } from '@angular/fire/app-check';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp({
      "projectId":"apollo-1e578",
      "appId":"1:442143619589:web:b7d5819239d02ea0beba6c",
      "storageBucket":"apollo-1e578.appspot.com",
      "apiKey":"AIzaSyDYUIeeYMI7VTBhP0v77g9Qz3YfPtrC5_I",
      "authDomain":"apollo-1e578.firebaseapp.com",
      "messagingSenderId":"442143619589"
    })),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    provideAppCheck(() => initializeAppCheck(getApp(), {
      provider: new ReCaptchaV3Provider('6LfFXCMqAAAAAMoupfGB5a3YDH3coVHaWcEUvIOh'),
    }))
  ]
};
