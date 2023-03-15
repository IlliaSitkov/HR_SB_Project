import { AxiosInstance } from 'axios';
import { authHost } from '../../http';
import { Specialty } from './types';

const axios: AxiosInstance = authHost;
const url: string = 'http://localhost:8000/api/specialties';

export const getAllSpecialties = async (): Promise<Specialty[]> => {
	return (await axios.get(url)).data;
};
