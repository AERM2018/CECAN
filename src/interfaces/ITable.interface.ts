import {
  IAlmacen,
  IAlmacenStore,
  IStorehouseRequestUtilities,
  IStorehouseRequestUtility,
} from "./IAlmacen.interface";
import { IHistorial, IPrescriptionHistory } from "./IHistorial.interface";
import { IFixedAsset } from "./IFixedAssest.interface";
import { IDepartment, Department } from "./IDepartments.interface";
import {
  IMedicineStock,
  IMedicine,
  IMedicineCatalog,
  IMedicineSuscription,
  IMedicineTotalStock,
} from "./IMedicineStock.interface";
import { User } from "./IUser.interface";
import { Stock } from "./IAlmacenListaResponse.response.interface";

export interface ITable extends IOnClick {
  headers: ITHeaders[];
  rows:
    | User[]
    | IMedicine[]
    | IMedicineCatalog[]
    | IPrescriptionHistory[]
    | IAlmacen[]
    | IAlmacenStore[]
    | IFixedAsset[]
    | Department[]
    | IMedicineStock[]
    | IMedicineSuscription[]
    | IMedicineTotalStock[]
    | IStorehouseRequestUtility[]
    | null;
  percentages: number[];
  keyName?: "id" | "folio" | "key" | "medicine_key";
  textDisplay?: CanvasTextAlign[];
  elements: string[];
}

interface ITHeaders {
  id:
    | keyof IMedicineStock
    | keyof IMedicine
    | keyof IMedicineCatalog
    | keyof IPrescriptionHistory
    | keyof IAlmacenStore
    | keyof IFixedAsset
    | keyof Department
    | HeadersButtons
    | keyof User
    | keyof IMedicineSuscription
    | keyof Stock
    | keyof IStorehouseRequestUtility;
  label: string;
}

export interface IOnClick {
  onClick?: any;
  onClick2?: any;
  onClick3?: any;
}

type HeadersButtons =
  | "remove"
  | "edit"
  | "add"
  | "delete"
  | "view"
  | "add"
  | "status"
  | "actions"
  | "details";
