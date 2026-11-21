import axios from "axios";
import { API_PATHS, BASE_URL } from "./apipaths"

export const TOKEN_KEY = 'token';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

//Req Interceptor


axiosInstance.interceptors.request.use(
  (config) => {
    let storedSession;

    try {
      storedSession = JSON.parse(
        localStorage.getItem(TOKEN_KEY)
      );
    } catch {
      storedSession = null;
    }

    const accessToken = storedSession?.token;

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);


  //Res Interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    //Handle common error globally

    if(error.response) {
      const isLoginRequest = error.config?.url === API_PATHS.AUTH.LOGIN;

      //wrong email/password also returns 401, so keep the user on the login form
      if(error.response.status === 401 && !isLoginRequest) {
        //clear the old session first, otherwise PublicRoute sends the user straight back
        localStorage.removeItem(TOKEN_KEY);

        //redirect login page
        window.location.href ="/login";
      }else if(error.response.status === 500){
        console.error("Server error. Please try again later");
      }
    } else if (error.code === "ECONNABORTED") {
  console.log("Request timeout. Please try again.");
}

    return Promise.reject(error);
  }
);

export default axiosInstance;