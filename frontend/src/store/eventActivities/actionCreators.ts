import { Activity } from '../../api/activity';
import { EVENT_ACTIVITIES_FETCHED } from './actionTypes';

export const eventActivitiesFetched = (activities: Activity[]) => {
	return {
		type: EVENT_ACTIVITIES_FETCHED,
		payload: {
			activities,
		},
	};
};
