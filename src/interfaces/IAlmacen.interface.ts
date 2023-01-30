export interface IAlmacen {
  id?: string;
  folio: number;
  created_at: string;
  name: string;
  status: string;
}

export interface IAlmacenStore {
  key: string;
  genericName: string;
  presentation?: string;
  quantity_per_unit?: number;
  quantity?: number;
  pieces_supplied?: number;
}

export interface IStorehouseUtility {
  id: string;
  name: string;
}

export interface IStorehouseRequestUtilities {
  utilities: IStorehouseRequestUtilities[];
}

export interface IStorehouseRequestUtility {
  key: string;
  pieces: number;
  generic_name: number;
  "details.generic_name"?: string;
  pieces_supplied?: number;
  last_pieces_supplied?: number;
  total_quantity_presentation_left?: number;
}

export interface IStorehouseRequest {
  id: string;
  user_id: string;
  folio: number;
  status_id: string;
  status: {
    id: number;
    name: string;
  };
  utilities?: IStorehouseRequestUtilities[];
}
