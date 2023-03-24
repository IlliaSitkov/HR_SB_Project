import { AxiosInstance } from 'axios';
import { authHost } from '../index';
import { Person, PersonBirthday, StatusUpdateDto } from './types';

const axios: AxiosInstance = authHost;
const url: string = 'http://localhost:8000/api/people';

const urlById = (id: number): string => `${url}/${id}`;

// const tempData = [
// 	{
// 		id: 1,
// 		name: 'Ira',
// 		surname: 'Matviienko',
// 		status: 'BRATCHYK',
// 	},
// 	{
// 		id: 2,
// 		name: 'User',
// 		surname: 'User',
// 		status: 'MALIUK',
// 	},
// 	{
// 		id: 3,
// 		name: 'Someone',
// 		surname: 'Someone',
// 		status: 'POSHANOVANYI',
// 	},
// ];

export const getAllPeople = async (): Promise<Person[]> => {
	const data = (await axios.get(url)).data;
	console.log('Got people: ');
	console.log(data);
	return data;
	//return tempData;
};

export const getPerson = async (id: number): Promise<Person> => {
	return (await axios.get(urlById(id))).data;
};

export const createPerson = async (person: Person): Promise<Person> => {
	return (await axios.post(url, person)).data;
};

export const deletePerson = async (id: number): Promise<Person> => {
	return (await axios.delete(urlById(id))).data;
};

export const updatePerson = async (
	id: number,
	person: Person
): Promise<Person> => {
	return (await axios.patch(urlById(id), person)).data;
};

export const updatePersonStatus = async (
	id: number,
	status: StatusUpdateDto
): Promise<Person> => {
	return (await axios.put(urlById(id) + '/status', status)).data;
};

export const getNearestBirthdays = async () => {
	const response = (
		await authHost.get<PersonBirthday[]>('/api/people/nearestBirthdays')
	).data;
	return response.map((r) => {
		r.birthday = new Date(r.birthday);
		if (!r.avatar) r.avatar = '';
		return r;
	});
};

export const syncBirthdays = async () => {
	const response = await authHost.get('/api/people/sync-birthdays');
	console.log(response);
	return response;
};

/*export const getAllRoles = async (): Promise<string[]> => {
	const data = (await axios.get(url + '/roles')).data;
	console.log('Got roles: ');
	console.log(data);
	return data;
};*/
