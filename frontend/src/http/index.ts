import axios, { AxiosRequestConfig } from 'axios';
import { getAccessToken } from '../utils/authConfig';

const host = axios.create({
	baseURL: process.env.REACT_APP_API_URL,
});

const authHost = axios.create({
	baseURL: process.env.REACT_APP_API_URL,
});

const authInterceptor = async (config: AxiosRequestConfig) => {
	config.headers!.Authorization = `Bearer ${await getAccessToken()}`;
	return config;
};

authHost.interceptors.request.use(authInterceptor);

export { host, authHost };
