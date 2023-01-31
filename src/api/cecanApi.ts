import axios from "axios";
import { getSession } from "next-auth/react";

let token = "";
if (typeof window !== "undefined") {
  token = window.localStorage.getItem("token");
}

export const getToken = () => {
  return new Promise<string | null>(async (resolve, reject) => {
    const session = await getSession();
    if (session != null || session.user != null) {
      token = session.user.token;
      resolve(session.user.token);
    } else {
      reject(null);
    }
  });
};

export const cecanApiPDF = axios.create({
  baseURL: process.env.API_BASE_URL,
  headers: {
    responseType: "blob",
    // "Content-Type": "apllication/pdf",
  },
});

const cecanApi = axios.create({
  baseURL: process.env.API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

cecanApi.interceptors.request.use(
  async (config) => {
    const finalToken = await getToken();
    config.headers.Authorization = `Bearer ${finalToken}`;
    return Promise.resolve(config);
  },
  (error) => {
    return Promise.reject(error);
  }
);

// cecanApiPDF.interceptors.request.use(
//   (config) => {
//     config.headers.Authorization = getAuthorizationHeader();
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

export default cecanApi;
