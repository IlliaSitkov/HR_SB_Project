import { AxiosInstance } from 'axios';
import { authHost } from '../index';
import { Event, EventPostDto, EventPatchDto } from './types';

const axios: AxiosInstance = authHost;
const url: string = 'http://localhost:8000/api/events';

const urlById = (id: number): string => `${url}/${id}`;

export const getAllEvents = async (): Promise<Event[]> => {
	return (await axios.get(url)).data;
};

export const getEvent = async (id: number): Promise<Event> => {
	return (await axios.get(urlById(id))).data;
};

export const createEvent = async (
	event: EventPostDto
): Promise<EventPostDto> => {
	return (await axios.post(url, event)).data;
};

export const deleteEvent = async (id: number): Promise<Event> => {
	return (await axios.delete(urlById(id))).data;
};

export const updateEvent = async (
	id: number,
	event: EventPatchDto
): Promise<Event> => {
	return (await axios.patch(urlById(id), event)).data;
};
