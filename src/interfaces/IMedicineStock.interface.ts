export interface IMedicineStock {
  key: string;
  id: string;
  lot_number: string;
  name: string;
  expires_at: string;
  pieces: number;
}

export interface IMedicine {
  key: string;
  name: string;
  quantity: number;
}

export interface IMedicineCatalog {
  key: string;
  name: string;
}

export interface IMedicineSuscription {
  prescription_id: string;
  medicine_key: string;
  details: IMedicine;
  pieces: number;
  pieces_supplied: number;
  last_pieces_supplied: number;
}
