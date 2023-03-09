import { AxiosInstance } from 'axios';
import { authHost } from '../index';
import { Specialty } from './types';

const axios: AxiosInstance = authHost;
const url: string = `${process.env.REACT_APP_API_URL}/api/specialties`;

export const getAllSpecialties = async (): Promise<Specialty[]> => {
	return (await axios.get(url)).data;
};
