import { AxiosInstance } from 'axios';
import { authHost } from '../../http';

const axios: AxiosInstance = authHost;
const url: string = 'http://localhost:8000/api/user';

export const getUserMe = async () => {
	return (await axios.get(`${url}/me`)).data;
};
