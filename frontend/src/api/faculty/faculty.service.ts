import { AxiosInstance } from 'axios';
import { authHost } from '../index';
import { Faculty } from './types';

const axios: AxiosInstance = authHost;
const url: string = `${process.env.REACT_APP_API_URL}/api/faculties`;

export const getAllFaculties = async (): Promise<Faculty[]> => {
	return (await axios.get(url)).data;
};
