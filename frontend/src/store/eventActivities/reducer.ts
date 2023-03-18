import { Activity } from '../../api/activity';
import { EVENT_ACTIVITIES_FETCHED } from './actionTypes';

const activitiesInitialState: Activity[] = [];

export const eventActivitiesReducer = (
	state: Activity[] = activitiesInitialState,
	action: any
) => {
	switch (action.type) {
		case EVENT_ACTIVITIES_FETCHED:
			return action.payload.activities;
		default:
			return state;
	}
};
