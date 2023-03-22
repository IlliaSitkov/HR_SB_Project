import { AxiosInstance } from 'axios';
import { authHost } from '../index';
import { Generation, GenerationCreateDTO, GenerationUpdateDTO } from './types';

const axios: AxiosInstance = authHost;
const url: string = 'http://localhost:8000/api/generations';

const urlById = (id: number): string => `${url}/${id}`;

export const getAllGenerations = async (): Promise<Generation[]> => {
	return (await axios.get(url)).data;
};

export const createGeneration = async (
	generation: GenerationCreateDTO
): Promise<Generation> => {
	return (await axios.post(url, generation)).data;
};

export const deleteGeneration = async (id: number): Promise<Generation> => {
	return (await axios.delete(urlById(id))).data;
};

export const updateGeneration = async (
	id: number,
	generation: GenerationUpdateDTO
): Promise<Generation> => {
	return (await axios.put(urlById(id), generation)).data;
};
