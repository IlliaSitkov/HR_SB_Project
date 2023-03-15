import { AxiosInstance } from 'axios';
import { authHost } from '../../http';
import { Faculty } from './types';

const axios: AxiosInstance = authHost;
const url: string = 'http://localhost:8000/api/faculties';

export const getAllFaculties = async (): Promise<Faculty[]> => {
	return (await axios.get(url)).data;
};
