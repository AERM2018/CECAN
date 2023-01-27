import { IMedicine, IMedicineSuscription } from "./IMedicineStock.interface";

export interface IPrescription {
  patient_name: string;
  observations: string;
  instructions: string;
  medicines: IMedicine[];
}

export interface IPrescriptionToSupply {
  patient_name: string;
  observations: string;
  instructions: string;
  medicines: IMedicineSuscription[];
}
