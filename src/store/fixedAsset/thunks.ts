import cecanApi, { getToken } from "api/cecanApi";
import { toast } from "react-hot-toast";
import { Dispatch } from "redux";
import {
  IDepartments,
  IDepartment,
} from "../../interfaces/IDepartments.interface";
import {
  addDepartment,
  deleteRequestFixedAsset,
  setActiveFixedRequest,
  setDepartments,
  setFixedAssets,
  setFixedAssetsRequests,
  setPages,
} from "./fixedAssetSlice";
import {
  IFixedAsset,
  IFixedAssetRequestResponse,
  IFixedAssetResponse,
  IRequestIDResponse,
} from "../../interfaces/IFixedAssest.interface";
import moment from "moment";
import download from "downloadjs";

export const startGetDepartments = () => async (dispatch: Dispatch) => {
  const response = await cecanApi.get<IDepartments>("/departments?limit=100");
  const departments = response.data.data.departments;
  const departmentsDateFixed = departments.map((department) => {
    department.created_at = moment(department.created_at).format("DD/MM/YYYY");
    department.updated_at = moment(department.updated_at).format("DD/MM/YYYY");
    return department;
  });
  dispatch(setDepartments(departmentsDateFixed));
};

export const startSetDepartments =
  (departments) => async (dispatch: Dispatch) => {
    toast.promise(cecanApi.post<IDepartment>("/departments", departments), {
      loading: "Agregando departamento",
      success: ({ data }) => {
        const { id, name, created_at, updated_at, deleted_at, floor_number } =
          data.data.department;
        dispatch(
          addDepartment({
            id,
            name,
            created_at,
            updated_at,
            deleted_at,
            floor_number,
            resposible_user_id: null,
          })
        );
        return "Departamento agregado";
      },
      error: (error) => {
        console.error(error);
        return "Error al agregar departamento";
      },
    });

    // dispatch(setDepartments(response.data));
  };

export const startGetFixedAssests =
  (filterQuery?: string, page?: number) => async (dispatch: Dispatch) => {
    const queries = {
      brand: filterQuery,
      model: filterQuery,
      type: filterQuery,
      physic_state: filterQuery,
      department_name: filterQuery,
      description: filterQuery,
    };
    const queriesString = Object.entries(queries)
      .map((entry) => `${entry[0]}=${entry[1]}`)
      .join("&");
    try {
      const { data } = await cecanApi.get<IFixedAssetResponse>(
        `/fixed_assets?page=${page}&${queriesString}`
      );
      console.log(data.data.fixed_assets);

      const dataFixedAssets = data.data.fixed_assets.map((fixedAsset) => ({
        ...fixedAsset,
        created_at: moment(fixedAsset.created_at).format("DD/MM/YYYY"),
      }));
      dispatch(setPages(data.pages));
      dispatch(setFixedAssets(dataFixedAssets));
    } catch (error) {}
  };

export const startAddingFixedAsset =
  (dataFixedAssets: any) => async (dispatch: Dispatch) => {
    toast.promise(
      cecanApi.post(
        `/fixed_assets_requests/departments/${dataFixedAssets[0].department_id}`,
        {
          fixed_assets: dataFixedAssets?.map((fixedAsset) => ({
            details: fixedAsset,
          })),
        }
      ),
      {
        loading: "Agregando activo fijo",
        success: () => {
          return "Activo fijo agregado";
        },
        error: (error) => {
          console.log(error);
          return "Error al agregar activo fijo";
        },
      }
    );
  };

export const startGetRequestFixedAssets = () => async (dispatch: Dispatch) => {
  const response = await cecanApi.get<IFixedAssetRequestResponse>(
    "/fixed_assets_requests"
  );
  const fixedAssets = response.data.data.fixed_assets_requests;
  dispatch(setFixedAssetsRequests(fixedAssets));
};

export const startDeleteRequestFixedAsset =
  (id: string) => async (dispatch: Dispatch) => {
    toast.promise(cecanApi.delete(`/fixed_assets_requests/${id}`), {
      loading: "Eliminando solicitud",
      success: () => {
        dispatch(deleteRequestFixedAsset(id));
        return "Solicitud eliminada";
      },
      error: "Error al eliminar solicitud",
    });
  };

export const startGetFixedAssetsRequestById =
  (id: string) => async (dispatch: Dispatch) => {
    toast.promise(
      cecanApi.get<IRequestIDResponse>(`/fixed_assets_requests/${id}`),
      {
        loading: "Cargando solicitud",
        success: (request) => {
          dispatch(
            setActiveFixedRequest(request.data.data.fixed_assets_request)
          );
          return "Solicitud cargada";
        },
        error: "Error al cargar solicitud",
      }
    );
  };

export const assignResponsibleDepartmentUser =
  (departmentId: string, userId: string) => async (dispatch: Dispatch) => {
    toast.promise(
      cecanApi.put(`/departments/${departmentId}/users/${userId}`),
      {
        loading: "Asignando responsable",
        success: () => {
          return "Responsable asignado";
        },
        error: "Error al asignar responsable",
      }
    );
  };

export const startPrintingFixedReport =
  (id: string) => async (dispatch: Dispatch) => {
    console.log("caca");
    const res = await fetch(
      `${process.env.API_BASE_URL}/fixed_assets_requests/${id}/?pdf=true`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${await getToken()}`,
          "Content-Type": "application/json",
        },
      }
    );

    const blob = await res.blob();

    download(blob, "Reporte Activo Fijo.pdf", "application/pdf");
  };

export const startUploadingFixedAssetFile =
  (files: FileList, cb: Function) => async (dispatch: Dispatch) => {
    const formData = new FormData();
    formData.append("excel_file", files[0]);
    const uploadFilePromise = fetch(
      `${process.env.API_BASE_URL}/fixed_assets/file`,
      {
        body: formData,
        method: "POST",
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
      }
    );
    const response = await toast.promise(uploadFilePromise, {
      loading: "Cargando datos...",
      success: (res) => {
        if (res.status != 204) {
          return "Ocurrió un error al importar los datos, hable con el administrador.";
        }
        return "Datos importados correctamente.";
      },
      error: (error) =>
        `Ocurrió un error al importar los datos, hable con el administrador.\n${error}`,
    });
    if (response.status == 204) cb();
  };
