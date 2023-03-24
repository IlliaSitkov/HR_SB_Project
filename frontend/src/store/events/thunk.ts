import { eventAdded, eventDeleted, eventUpdated } from './actionCreators';
import { createEvent, updateEvent, deleteEvent, Event } from '../../api/event';
import { errorMessageSet } from '../errorMessage/actionCreators';
import { errorToString } from '../../utils/errorHandling';

export function saveNewEvent(event: Event) {
	return async function saveNewEventThunk(dispatch: any, getState: any) {
		try {
			const response = await createEvent(event);
			dispatch(eventAdded(response));
		} catch (e) {
			dispatch(errorMessageSet(errorToString(e)));
		}
	};
}

export function updateAnEvent(id: number, event: Event) {
	return async function updateEventThunk(dispatch: any, getState: any) {
		try {
			const response = await updateEvent(id, event);
			dispatch(eventUpdated(response));
		} catch (e) {
			dispatch(errorMessageSet(errorToString(e)));
		}
	};
}

export function deleteAnEvent(id: number) {
	return async function deleteEventThunk(dispatch: any, getState: any) {
		try {
			await deleteEvent(id);
			dispatch(eventDeleted(id));
		} catch (e) {
			dispatch(errorMessageSet(errorToString(e)));
		}
	};
}
