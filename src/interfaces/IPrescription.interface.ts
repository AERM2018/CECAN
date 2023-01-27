import { IMedicine, IMedicineSuscription } from "./IMedicineStock.interface";

export interface IPrescription {
  patient_name: string;
  observations: string;
  instructions: string;
  medicines: IMedicine[];
}

export interface IPrescriptionToSupply {
  id: string;
  folio: string;
  patient_name: string;
  observations: string;
  instructions: string;
  prescription_status: {
    name: string;
  };
  medicines: IMedicineSuscription[];
}
