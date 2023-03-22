import { Event } from '../../api/event';
import {
	GET_EVENTS,
	ADD_EVENT,
	UPDATE_EVENT,
	DELETE_EVENT,
} from './actionTypes';

// After success getting events from API - array of events.
const eventsInitialState: Array<Event> = [];

export default function eventsReducer(state = eventsInitialState, action: any) {
	switch (action.type) {
		case GET_EVENTS: {
			return action.payload;
		}
		case ADD_EVENT: {
			return [...state, action.payload];
		}
		case DELETE_EVENT: {
			return state.filter((event) => {
				return event.id !== action.payload;
			});
		}
		case UPDATE_EVENT: {
			const { id } = action.payload;
			return state.map((event) => {
				// If this isn't the event item we're looking for, leave it alone
				if (event.id !== id) {
					return event;
				}
				// We've found the event that has to change. Return a copy:
				return action.payload;
			});
		}
		default:
			return state;
	}
}
