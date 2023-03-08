import {ADD_PERSON, DELETE_PERSON, GET_PEOPLE, UPDATE_PERSON, UPDATE_PERSON_STATUS} from "./actionTypes";
import {Person} from '../../api/person';

// After success getting people from API - array of people.
const peopleInitialState : Array<Person> = [];

export default function peopleReducer(state = peopleInitialState, action: any) {
	switch (action.type) {
		case ADD_PERSON: {
			return [...state, action.payload];
		}
		case DELETE_PERSON: {
			return state.filter((person) => person.id !== action.payload);
		}
		case UPDATE_PERSON: {
			const { id } = action.payload;
			return state.map((person) => {
				// If this isn't the person item we're looking for, leave it alone
				if (person.id !== id) {
					return person;
				}
				// We've found the person that has to change. Return a copy:
				return action.payload;
			});
		}
		//???
		case UPDATE_PERSON_STATUS: {
			const { id } = action.payload;
			return state.map((person) => {
				if (person.id !== id) {
					return person;
				}
				return action.payload;
			});
		}
		case GET_PEOPLE: {
			return action.payload;
		}
		default:
			return state;
	}
}
