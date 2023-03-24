import { Event } from '../../api/event';
import {
	GET_EVENTS,
	ADD_EVENT,
	UPDATE_EVENT,
	DELETE_EVENT,
} from './actionTypes';

export const eventsGet = (newEvents: Array<Event>) => ({
	type: GET_EVENTS,
	payload: newEvents,
});

export const eventAdded = (event: Event) => ({
	type: ADD_EVENT,
	payload: event,
});

export const eventDeleted = (eventId: number) => ({
	type: DELETE_EVENT,
	payload: eventId,
});

export const eventUpdated = (event: Event) => ({
	type: UPDATE_EVENT,
	payload: event,
});
