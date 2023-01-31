import cecanApi from "api/cecanApi";
import { AxiosResponse } from "axios";
import {
  IAuthResponse,
  IRenewResponse,
} from "interfaces/IAuth.response.interface";
import Router from "next/router";
import { toast } from "react-hot-toast";
import { Dispatch } from "redux";
import { login } from "./authSlice";
import { signIn, getSession } from "next-auth/react";
import { useGetAccess } from "../../hooks/useGetAccess";

export const startLogin = ({
  username,
  password,
}: {
  username: string;
  password: string;
}) => {
  return async (dispatch: Dispatch) => {
    const res = await signIn("login", {
      redirect: false,
      username,
      password,
    });
    console.log({ res });
    if (res.ok) {
      toast.promise(getSession(), {
        loading: "Iniciando sesión...",
        success: (session) => {
          dispatch(
            login({
              token: session.user.token,
              user: session.user.user,
            })
          );
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const items = useGetAccess(session.user.user.role.name);
          Router.push(`/${items[0].path}`);
          return `Bienvenido ${session.user.user.full_name}`;
        },
        error: () => {
          return "Hubo un error al iniciar sesión, intentelo más tarde";
        },
      });
      const session = await getSession();
    }
  };
};

export const renewToken = () => {
  const req = cecanApi.post<IRenewResponse>("/auth/renew");

  return async (dispatch: Dispatch) => {
    toast.promise(req, {
      loading: "Renovando token...",
      error: "Hubo un error al renovar el token",
      success: ({ data: { data, ok } }: AxiosResponse<IRenewResponse>) => {
        dispatch(
          login({
            token: data.token,
            user: null,
          })
        );
        localStorage.setItem("token", data.token);
        return "Token renovado";
      },
    });
  };
};

export const startSignUp = ({
  name,
  surname,
  email,
  password,
  role_id,
}: {
  name: string;
  surname: string;
  email: string;
  password: string;
  role_id: string;
}) => {
  const req = cecanApi.post("/auth/signup", {
    name,
    surname,
    email,
    password,
    role_id,
  });

  return async (dispatch: Dispatch) => {
    toast.promise(req, {
      loading: "Creando usuario...",
      error: "Hubo un error al crear el usuario",
      success: () => {
        return "Usuario creado";
      },
    });
  };
};
