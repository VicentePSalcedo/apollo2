import { Timestamp } from "@angular/fire/firestore";

export interface Entry {
  id: string;
  timeStamp: number;
  date: string;
  lotNo: number;
  address: string;
  boards: number;
  smoothB1: number;
  smoothB2: number;
  smoothHoQa: number;
  textureB1: number;
  textureB2: number;
  textureHoQa: number;
  repairsOrWarranty: number;
  observations: string;
  image: string[];
  workers: string;
  ttl: Timestamp;
}
