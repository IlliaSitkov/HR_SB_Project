import { AxiosInstance } from 'axios';
import { authHost } from '../index';
import { Category, CategoryCreateDTO, CategoryUpdateDTO } from './types';

const axios: AxiosInstance = authHost;
const url: string = `${process.env.REACT_APP_API_URL}/api/categories`;

const urlById = (id: number): string => `${url}/${id}`;

export const getAllCategories = async (): Promise<Category[]> => {
	return (await axios.get(url)).data;
};

export const createCategory = async (
	category: CategoryCreateDTO
): Promise<Category> => {
	return (await axios.post(url, category)).data;
};

export const deleteCategory = async (id: number): Promise<Category> => {
	return (await axios.delete(urlById(id))).data;
};

export const updateCategory = async (
	id: number,
	category: CategoryUpdateDTO
): Promise<Category> => {
	return (await axios.put(urlById(id), category)).data;
};

// import {AxiosInstance} from "axios";
// import {host} from "../../http";
// import {Category, CategoryCreateDTO, CategoryUpdateDTO} from "./types";
//
// export class CategoryService {
//
//     axios: AxiosInstance = host;
//     readonly url: string = "api/categories"
//
//     urlById = (id: number): string => `${url}/${id}`;
//
//     getAllCategories = async (): Promise<Category[]> => {
//         return (await axios.get(url)).data;
//     };
//
//     createCategory = async (category: CategoryCreateDTO): Promise<Category> => {
//         return (await axios.post(url, category)).data;
//     };
//
//     deleteCategory = async (id: number): Promise<Category> => {
//         return (await axios.delete(urlById(id))).data;
//     };
//
//     updateCategory = async (id: number, category: CategoryUpdateDTO): Promise<Category> => {
//         return (await axios.put(urlById(id), category)).data;
//     };
//
//
// }
//
//
