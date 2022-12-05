// // Generated by https://quicktype.io

export interface IAlmacenListResponse {
    data: Data;
    ok:   boolean;
}

export interface Data {
    inventory: Inventory[];
}

export interface Inventory {
    storehouse_utility:               StorehouseUtility;
    stocks:                           Stock[];
    total_quantity_parsed_left:       number;
    total_quantity_presentation_left: number;
}

export interface Stock {
    id:                         string;
    storehouse_utility_key:     string;
    quantity_parsed:            number;
    quantity_parsed_used:       number;
    quantity_presentation:      number;
    quantity_presentation_used: number;
    lot_number:                 string;
    catalog_number:             string;
    expires_at:                 string;
    created_at:                 string;
    updated_at:                 string;
}

export interface StorehouseUtility {
    key:               string;
    generic_name:      string;
    unit_id:           string;
    unit:              Category;
    presentation_id:   string;
    presentation:      Category;
    category_id:       string;
    category:          Category;
    quantity_per_unit: number;
    description:       string;
    created_at:        string;
    updated_at:        string;
    deleted_at:        null;
}

export interface Category {
    id:   string;
    name: string;
}