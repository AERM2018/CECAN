import cecanApi, { getToken } from "api/cecanApi";
import {
  IRequestStoreHouseDataResponse,
  IRequestStoreHouseResponse,
  RequestWithUtilities,
} from "interfaces/IRequestStore.response.interface";
import moment from "moment";
import 'moment-timezone';
import { toast } from "react-hot-toast";
import { Dispatch } from "redux";
import {
  clearActiveStorehouseUtilities,
  removeStorehouseRequest,
  setActiveStorehouseRequest,
  setCatalogPages,
  setCategories,
  setInventory,
  setInventoryLessQty,
  setInventoryPages,
  setPresentations,
  setRequests,
  setStorehouseCatalogData,
  setUnits,
} from "./requests.slice";
import "moment/locale/es";
import { Request } from "interfaces/IRequestStore.response.interface";
import { IAlmacenCatalogResponse, IAlmacenListResponse } from "interfaces/IAlmacenListaResponse.response.interface";
import { AppDispatch } from "../store";
import {
  IAlmacenStore,
  IStorehouseRequestUtilities,
} from "interfaces/IAlmacen.interface";
import download from "downloadjs";
import { getFilePropsFromResponse } from "helpers/getFileName";
import { setLoading } from "store/ui/uiSlice";

export const startGetRequestStorehouse = () => async (dispatch: Dispatch) => {
  dispatch(setLoading(true));
  const {
    data: { data, ok },
  } = await cecanApi.get<IRequestStoreHouseResponse>("/storehouse/requests");
  moment.locale("es");
  dispatch(setLoading(false)); 
  if (ok) {
    dispatch(
      setRequests(
        data.requests.map((item) => ({
          id: item.id,
          created_at: moment.utc(item.created_at).utc().format("DD/MM/YYYY hh:mm A"),
          folio: item.folio,
          name: item.user.name,
          status: item.status.name,
        }))
      )
    );
  } else {
    toast.error("Error al obtener los datos de la farmacia");
    console.log(data);
  }
};

export const startGetStorehouseCatalogData = (filters?:{concidence?:string, page?:number, limit?:number}) => async ( dispatch: Dispatch) => {
  const {concidence = "", page = 1, limit = 10} = filters || {}
   let queryParams = `?page=${page}&`;
      const filtersObj = {
        utility_name: concidence,
        utility_key: concidence,
        limit: limit
      }
      queryParams += `${Object.keys(filtersObj).map((key) => `${key}=${filtersObj[key]}`).join("&")}`
    dispatch(setLoading(true));
  const {
    data: { data, ok, pages },
  } = await cecanApi.get<IAlmacenCatalogResponse>(`/storehouse_utilities${queryParams}`);
  moment.locale("es");
  dispatch(setLoading(false));
  const dateFormat = "DD/MM/YYYY hh:mm A";
  if (ok) {
    const storehouseCatalogData = data.storehouse_utilities.map((utility) => (
      {...utility, created_at: moment(utility.created_at).format(dateFormat), updated_at: moment(utility.updated_at).format(dateFormat)}
    ))
    dispatch(setCatalogPages(pages))
    dispatch(setStorehouseCatalogData(storehouseCatalogData))
  }

}

export const startGetStorehouseList =
  ({
    concidence = "",
    showLessQty = false,
    page = 1,
  }: {
    concidence?: string;
    page?: number;
    showLessQty?: boolean;
  }) =>
  async (dispatch: Dispatch) => {
    let queryParams = `?page=${page}&`;
    if(showLessQty) queryParams += "show_less_qty=true&"
    if(concidence != ""){
      const filters = {
        utility_name: concidence,
        utility_key: concidence,
      }
      queryParams += `${Object.keys(filters).map((key) => `${key}=${filters[key]}`).join("&")}`
    }
    dispatch(setLoading(true));
    const {
      data: { data, ok,pages },
    } = await cecanApi.get<IAlmacenListResponse>(`/storehouse_inventory${queryParams}`);
    moment.locale("es");
    setTimeout(() => { dispatch(setLoading(false)); }, 3000);
    if (ok) {
      const dataStorehouseUtilities = data.inventory.map((record) => {
            return {
              lot_number: record.lot_number ? record.lot_number : "",
              catalog_number: record.catalog_number ? record.catalog_number : "",
              key: record.storehouse_utility.key,
              generic_name: record.storehouse_utility.generic_name,
              storehouse_utility: {final_presentation : record.storehouse_utility.final_presentation},
              quantity_presentation_left: record.quantity_presentation_left != undefined ? record.quantity_presentation_left : record.total_quantity_presentation_left,
              expires_at: record.expires_at ? moment(record.expires_at).utc().format("DD/MM/YYYY") : "",
              semaforization_color: record.semaforization_color ? record.semaforization_color : "",
            } as IAlmacenStore;
          })
      dispatch(setInventoryPages(pages));
      dispatch(setInventory(dataStorehouseUtilities));
    } else {
      toast.error("Error al obtener los datos de la farmacia");
      console.log(data);
    }
  };

export const startGetUnitsStorehouse = () => async (dispatch: AppDispatch) => {
  try {
    const {
      data: { data, ok },
    } = await cecanApi.get("/storehouse_utilities/units");
    if (ok) {
      dispatch(setUnits(data.storehouse_utility_units));
    }
  } catch (error) {}
};

export const startGetCategoriesStorehouse =
  () => async (dispatch: AppDispatch) => {
    try {
      const {
        data: { data, ok },
      } = await cecanApi.get("/storehouse_utilities/categories");
      if (ok) {
        dispatch(setCategories(data.storehouse_utility_categories));
      }
    } catch (error) {}
  };

export const startGetPresentationsStorehouse =
  () => async (dispatch: AppDispatch) => {
    try {
      const {
        data: { data, ok },
      } = await cecanApi.get("/storehouse_utilities/presentations");
      if (ok) {
        dispatch(setPresentations(data.storehouse_utility_presentations));
      }
    } catch (error) {}
  };

export const startAddStorehouseUtility =
  (values: any, resetForm: () => void) => async (dispatch: AppDispatch) => {
    values.quantity_per_unit = parseInt(values.quantity_per_unit);
    try {
      toast.promise(cecanApi.post("/storehouse_utilities", values), {
        loading: "Guardando...",
        success: (data) => {
          resetForm();
          return "Guardado correctamente";
        },
        error: (error) => {
          console.log(error);
          return "Error al guardar";
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

export const startAddStockStorehouse =
  (values: any, resetForm: () => void) => async (dispatch: AppDispatch) => {
    const { quantity_presentation } = values;
    toast.promise(
      cecanApi.post(
        `/storehouse_utilities/${values.key}/storehouse_inventory`,
        {
          ...values,
          quantity_presentation: parseInt(values.quantity_presentation),
          expires_at: moment(values.expires_at).format(
            "YYYY-MM-DD[T]HH:mm:ssZ"
          ),
        }
      ),
      {
        loading: "Guardando...",
        success: (data) => {
          resetForm();
          return "Stock añadido correctamente";
        },
        error: (error) => {
          console.log(error);
          return "Error al guardar";
        },
      }
    );
  };

export const startGeneratingRequest =
  (utilities: IAlmacenStore[]) => async (dispatch: Dispatch) => {
    toast.promise(
      cecanApi.post("/storehouse/requests", {
        utilities: utilities.map((utility) => ({
          key: utility.key,
          pieces: utility.quantity,
        })),
      }),
      {
        loading: "Generando solicitud",
        success: (data) => {
          dispatch(clearActiveStorehouseUtilities());
          return "Solicitud generada correctamente";
        },
        error: (error) => {
          console.log(error);
          return error.response.data.error;
        },
      }
    );
  };

export const startFilterUtilities =
  (concidence: string, utilities: IAlmacenStore[], from: string) =>
  async (dispatch: Dispatch) => {
    concidence = concidence.toLocaleLowerCase();
    utilities = utilities.filter((utility: IAlmacenStore) =>
      concidence != ""
        ? utility.key.toLocaleLowerCase().includes(concidence) ||
          utility.generic_name.toLocaleLowerCase().includes(concidence)
        : true
    );
    switch (from) {
      case "catalog":
        dispatch(setInventory(utilities));
      // break;
      case "generateRequest":
        dispatch(setInventory(utilities));
        break;
      case "catalogLessQty":
        dispatch(setInventoryLessQty(utilities));
        break;
      default:
        break;
    }
  };

export const startDeletingRequest =
  (id: string) => async (dispatch: Dispatch) => {
    toast.promise(cecanApi.delete(`/storehouse/requests/${id}`), {
      loading: "Eliminando solicitud",
      success: (data) => {
        dispatch(removeStorehouseRequest(id));
        return "Solicitud eliminada correctamente";
      },
      error: (error) => {
        console.log(error);
        return error.response.data.error;
      },
    });
  };

export const startDownloadingRequest =
  (id: string) => async (dispatch: Dispatch) => {
    const res = await fetch(
      `${process.env.API_BASE_URL}/storehouse/requests/${id}?pdf=true`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${await getToken()}`,
          "Content-Type": "application/json",
        },
      }
    );

    // res.headers.forEach(console.log);
    const { filename, type } = getFilePropsFromResponse(res.headers);
    const pdf = await res.blob();

    download(pdf, filename, type);
  };

export const startGettingRequestById =
  (id: string) => async (dispatch: Dispatch) => {
    try {
      const {
        data: { data, ok },
      } = await cecanApi.get<IRequestStoreHouseDataResponse>(
        `/storehouse/requests/${id}`
      );
      if (ok) {
        data.request.utilities = data.request.utilities.map((utility) => ({
          ...utility,
          pieces_supplied: 0,
        }));
        dispatch(setActiveStorehouseRequest(data.request));
      } else {
        toast.error(
          "Ocurrió un error al cargar la solicitud, intentelo más tarde."
        );
      }
    } catch (axios) {
      toast.error(axios.response.data.error);
    }
  };

export const startSupplyingRequest =
  (request: RequestWithUtilities) => async (dispatch: Dispatch) => {
    try {
      const {
        data: { data, ok },
      } = await cecanApi.put<IRequestStoreHouseDataResponse>(
        `/storehouse/requests/${request.id}/complete`,
        JSON.stringify({
          utilities: request.utilities.map((utility) => ({
            key: utility.key,
            pieces_supplied: utility.pieces_supplied,
          })),
        })
      );
      if (ok) {
        toast.success("La solicitud fue suministrada correctamente.");
      } else {
        toast.error(
          "Ocurrió un error al cargar la solicitud, intentelo más tarde."
        );
      }
    } catch (axios) {
      toast.error(axios.response.data.error);
    }
  };
