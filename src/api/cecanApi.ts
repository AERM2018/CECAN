import axios from "axios";

let token = "";
if (typeof window !== "undefined") {
  token = window.localStorage.getItem("token");
}

export const getToken = () =>
  typeof window !== "undefined" && window.localStorage.getItem("token")
    ? window.localStorage.getItem("token")
    : null;

export const getAuthorizationHeader = () => `Bearer ${getToken()}`;

export const cecanApiPDF = axios.create({
  baseURL: process.env.API_BASE_URL,
  headers: {
    responseType: "blob",
    // "Content-Type": "apllication/pdf",
    Authorization: `Bearer ${getAuthorizationHeader()}`,
  },
});

const cecanApi = axios.create({
  baseURL: process.env.API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getAuthorizationHeader()}`,
  },
});

cecanApi.interceptors.request.use(
  (config) => {
    config.headers.Authorization = getAuthorizationHeader();
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

cecanApiPDF.interceptors.request.use(
  (config) => {
    config.headers.Authorization = getAuthorizationHeader();
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default cecanApi;
