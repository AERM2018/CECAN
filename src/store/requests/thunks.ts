import cecanApi, { getToken } from "api/cecanApi";
import {
  IRequestStoreHouseDataResponse,
  IRequestStoreHouseResponse,
  RequestWithUtilities,
} from "interfaces/IRequestStore.response.interface";
import moment from "moment";
import { toast } from "react-hot-toast";
import { Dispatch } from "redux";
import {
  clearActiveStorehouseUtilities,
  removeStorehouseRequest,
  setActiveStorehouseRequest,
  setCategories,
  setInventory,
  setInventoryLessQty,
  setPresentations,
  setRequests,
  setUnits,
} from "./requests.slice";
import "moment/locale/es";
import { Request } from "interfaces/IRequestStore.response.interface";
import { IAlmacenListResponse } from "interfaces/IAlmacenListaResponse.response.interface";
import { AppDispatch } from "../store";
import {
  IAlmacenStore,
  IStorehouseRequestUtilities,
} from "interfaces/IAlmacen.interface";
import download from "downloadjs";
import { getFilePropsFromResponse } from "helpers/getFileName";

export const startGetRequestStorehouse = () => async (dispatch: Dispatch) => {
  const {
    data: { data, ok },
  } = await cecanApi.get<IRequestStoreHouseResponse>("/storehouse/requests");
  moment.locale("es");
  if (ok) {
    dispatch(
      setRequests(
        data.requests.map((item) => ({
          id: item.id,
          created_at: moment.utc(item.created_at).format("DD/MM/YYYY hh:mm A"),
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

export const startGetStorehouseList =
  ({
    searchStocks = true,
    showLessQty = false,
  }: {
    searchStocks?: boolean;
    showLessQty?: boolean;
  }) =>
  async (dispatch: Dispatch) => {
    const {
      data: { data, ok },
    } = await cecanApi.get<IAlmacenListResponse>("/storehouse_inventory");
    moment.locale("es");
    if (ok) {
      let inventorySummarized = data.inventory
        .map((item) => {
          if (item.stocks.length == 0 || !searchStocks || showLessQty) {
            return [
              {
                quantity: 0,
                lot_number: "No definido",
                catalog_number: "No definido",
                key: item.storehouse_utility.key,
                genericName: item.storehouse_utility.generic_name,
                presentation: `${item.storehouse_utility.presentation.name} de ${item.storehouse_utility.quantity_per_unit} ${item.storehouse_utility.unit.name}`,
                expires_at: "N/A",
                total_quantity_presentation_left:
                  item.total_quantity_presentation_left,
              },
            ];
          }
          return item.stocks.map((stock) => {
            return {
              quantity:
                stock.quantity_presentation - stock.quantity_presentation_used,
              lot_number: stock.lot_number,
              catalog_number: stock.catalog_number,
              key: stock.storehouse_utility_key,
              genericName: item.storehouse_utility.generic_name,
              presentation: `${item.storehouse_utility.presentation.name} de ${item.storehouse_utility.quantity_per_unit} ${item.storehouse_utility.unit.name}`,
              expires_at: moment.utc(stock.expires_at).format("DD/MM/YYYY"),
              total_quantity_presentation_left: 0,
            };
          });
        })
        .flat();
      if (showLessQty) {
        inventorySummarized = inventorySummarized.filter(
          (inventoryRecord) =>
            inventoryRecord.total_quantity_presentation_left <= 100
        );
        dispatch(setInventoryLessQty(inventorySummarized));
        return;
      }
      dispatch(setInventory(inventorySummarized));
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
          utility.genericName.toLocaleLowerCase().includes(concidence)
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
