import { AxiosInstance } from 'axios';
import { authHost } from '../index';
import { EventPostDto } from './types';

const axios: AxiosInstance = authHost;
const url: string = `${process.env.REACT_APP_API_URL}/api/events`;

export const createEvent = async (event: EventPostDto): Promise<object> => {
	return (await axios.post(url, event)).data;
};
