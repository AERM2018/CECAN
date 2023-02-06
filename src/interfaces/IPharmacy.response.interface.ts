export interface IPharmacyCatalogResponse {
  data: CatalogData;
  ok: boolean;
}

export interface IPharmacyDataResponse {
  data: Data;
  ok: boolean;
}

export interface Data {
  inventory: Inventory[] | Stock[];
}

export interface CatalogData {
  medicines: Medicine[];
}

export interface Inventory {
  medicine_key: string;
  medicine: Medicine;
  stocks?: Stock[];
  pieces_left_by_semaforization_color: PiecesLeftBySemaforizationColor;
  total_pieces: number;
  total_pieces_left: number;
}

export interface Medicine {
  key: string;
  name: string;
  created_at?: string;
  updated_at?: string;
  deleted_at: null;
}

export interface PiecesLeftBySemaforizationColor {
  ambar: number;
}

export interface Stock {
  id: string;
  lot_number: string;
  pieces: number;
  pieces_used: number;
  pieces_left: number;
  expires_at: string;
  semaforization_color: string;
}
