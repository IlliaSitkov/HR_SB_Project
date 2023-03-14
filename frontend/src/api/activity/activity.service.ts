import { AxiosInstance } from 'axios';
import { authHost } from '../../http';
import { Activity } from './types';

const axios: AxiosInstance = authHost;
const url: string = 'http://localhost:8000/api/categories/activities';

export const getActivitiesOfUser = async (
	personId: number
): Promise<Activity[]> => {
	return (await axios.get(`${url}?personId=${personId}`)).data.map(
		(d: Activity) =>
			new Activity(
				d.person_id,
				d.event_id,
				d.hours,
				d.position,
				d.contribution,
				d.event
			)
	);
};
