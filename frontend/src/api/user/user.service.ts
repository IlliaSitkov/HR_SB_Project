import { AxiosInstance } from 'axios';
import { authHost } from '../../http';
import { User, UserRole } from '../common/types';

const axios: AxiosInstance = authHost;
const url: string = 'http://localhost:8000/api/user';

export const getUserMe = async () => {
	return (await axios.get(`${url}/me`)).data;
};

export const getUserByEmail = async (email: string) => {
	return (await axios.get(`${url}/by_email/${email}`)).data;
};

export const createUser = async (user: User): Promise<User> => {
	return (await axios.post(url, user)).data;
};

export const deleteUser = async (id: number): Promise<User> => {
	return (await axios.delete(`${url}/${id}`)).data;
};

export const updateUser = async (id: number, role: UserRole): Promise<User> => {
	return (await axios.put(`${url}/${id}`, { role: role })).data;
};