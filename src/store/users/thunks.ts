import cecanApi from "api/cecanApi";
import { IUserResponse } from "interfaces/IUser.interface";
import { Dispatch } from "redux";
import { setRoles, setUsers } from "./usersSlice";
import { toast } from "react-hot-toast";
import { IRolesResponse } from "../../interfaces/responses/IRoles.response.inrerface";
import { setLoading } from "store/ui/uiSlice";

export const startGetUsers = () => async (dispatch: Dispatch) => {
  dispatch(setLoading(true));
  const {
    data: { data, ok },
  } = await cecanApi.get<IUserResponse>("/users");
 dispatch(setLoading(false))
  if (ok) {
    dispatch(setUsers(data.users));
  } else {
    toast.error("Error al obtener los usuarios");
    console.log(data);
  }
};

export const startGetRoles = () => async (dispatch: Dispatch) => {
  const {
    data: { data, ok },
  } = await cecanApi.get<IRolesResponse>("/roles");
  if (ok) {
    dispatch(setRoles(data.roles));
  } else {
    toast.error("Error al obtener los roles");
    console.log(data);
  }
};
