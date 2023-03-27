import { AxiosInstance } from 'axios';
import { authHost } from '../index';
import { User, UserRole } from '../common/types';
import { getGraphApiAccessToken, graphConfig } from '../../utils/authConfig';

const axios: AxiosInstance = authHost;
const url: string = 'http://localhost:8000/api/user';

export const getUserMe = async (): Promise<User> => {
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

export const getProfilePhoto = async (userEmail: string) => {
	return await fetch(
		`${graphConfig.graphPhotoEndpoint}users/${userEmail}/photo/$value`,
		{
			method: 'Get',
			headers: { Authorization: `Bearer ${await getGraphApiAccessToken()}` },
		}
	).then(async (o) => {
		const url = window.URL || window.webkitURL;
		return url.createObjectURL(await o.blob());
	});
};
