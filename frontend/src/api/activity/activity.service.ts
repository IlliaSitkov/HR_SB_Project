import { AxiosInstance } from 'axios';
import { authHost } from '../../http';
import { Activity, ActivityPost, ActivityUpdate } from './types';

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
				d.event,
				d.person
			)
	);
};

export const getActivitiesOfEvent = async (
	eventId: number
): Promise<Activity[]> => {
	return (await axios.get(`${url}?eventId=${eventId}`)).data.map(
		(d: Activity) =>
			new Activity(
				d.person_id,
				d.event_id,
				d.hours,
				d.position,
				d.contribution,
				d.event,
				d.person
			)
	);
};

export const updateActivity = async (
	update: ActivityUpdate
): Promise<Activity[]> => {
	return (await axios.put(url, update)).data;
};

export const createActivity = async (
	activity: ActivityPost
): Promise<Activity[]> => {
	return (await axios.post(url, activity)).data;
};

export const deleteActivity = async (
	personId: number,
	eventId: number
): Promise<Activity[]> => {
	return (
		await axios.delete(url, {
			data: { person_id: personId, event_id: eventId },
		})
	).data;
};
