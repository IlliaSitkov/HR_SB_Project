import { createActivity, getActivitiesOfEvent } from '../../api/activity';
import { eventActivitiesFetched } from './actionCreators';

export const fetchEventActivitiesThunk =
	(eventId: number) => async (dispatch: Function) => {
		try {
			const acts = await getActivitiesOfEvent(eventId);
			dispatch(eventActivitiesFetched(acts));
		} catch (e) {
			console.log(e);
		}
	};

export const createEventActivitiesThunk =
	(eventId: number, personId: number) => async (dispatch: Function) => {
		try {
			await createActivity({
				person_id: personId,
				event_id: eventId,
			});
			dispatch(fetchEventActivitiesThunk(eventId));
		} catch (e) {
			console.log(e);
		}
	};
