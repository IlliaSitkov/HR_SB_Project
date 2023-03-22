import axios, { AxiosRequestConfig } from 'axios';
import { getAccessToken, isAuthenticated } from '../utils/authConfig';

const host = axios.create({
	baseURL: process.env.REACT_APP_API_URL,
});

const authHost = axios.create({
	baseURL: process.env.REACT_APP_API_URL,
});

const authInterceptor = async (config: AxiosRequestConfig) => {
	if (isAuthenticated()) {
		config.headers!.Authorization = `Bearer ${await getAccessToken()}`;
	}
	return config;
};

authHost.interceptors.request.use(authInterceptor);

export { host, authHost };
