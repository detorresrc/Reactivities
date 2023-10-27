import { router } from "@/app/router/Router";
import { PaginatedResults } from "@/models/pagination";
import useErrorStore from "@/store/features/error";
import useUserStore from "@/store/features/user";
import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const responseBody = <T>(response: AxiosResponse<T>) => response.data;
const sleep = (delay: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
};

const requests = {
  get: <T>(url: string) => API.get<T>(url).then(responseBody),
  // eslint-disable-next-line @typescript-eslint/ban-types
  post: <T>(url: string, body: {}) => API.post<T>(url, body).then(responseBody),
  // eslint-disable-next-line @typescript-eslint/ban-types
  put: <T>(url: string, body: {}) => API.put<T>(url, body).then(responseBody),
  del: <T>(url: string) => API.delete<T>(url).then(responseBody),
};

API.interceptors.request.use(async (config) => {
  const token = useUserStore.getState().user?.token || '';

  if(token && config .headers){
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

API.interceptors.response.use(async (response) => {
  
  if(import.meta.env.DEV) await sleep(1500);

  const pagination = response.headers['pagination'];
  if(pagination) {
    response.data = new PaginatedResults(response.data, JSON.parse(pagination));
    return response as AxiosResponse<PaginatedResults<any>>;
  }
  
  return response;
}, (error: AxiosError) => {
  const {data, status, config, headers} = error.response as AxiosResponse;
  const errorStore = useErrorStore.getState();

  switch(status){
    case 400:
      console.log({data});
      if(config.method === 'get' && data.errors.hasOwnProperty("id")){
        router.navigate("/not-found");
      }else if(data.errors){
        const modalStateErrors = [];
        for(const key in data.errors){
          if(data.errors[key]){
            modalStateErrors.push(data.errors[key])
          }
        }
        throw modalStateErrors.flat();
      }else{
        toast.error(data);
      }
      break;
    case 401:
      console.log({headers});
      if(status === 401 && headers['www-authenticate']?.startsWith('Bearer error="invalid_token"')){
        useUserStore.getState().logout();
        toast.error('Session expired- please login again!');
      }else{
        toast.error('Unauthorized!');
      }
      break;
    case 403:
      toast.error("Forbidden!");
      break;
    case 404:
      router.navigate('/not-found');
      break;
    case 500:
      errorStore.setError(data);
      router.navigate('/server-error');
      toast.error("Server Error!");
      break;
      
  }
  return Promise.reject(error);
});

export { requests };

export default API;
