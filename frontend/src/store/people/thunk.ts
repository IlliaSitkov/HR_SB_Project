import {
	peopleGet,
	personAdded,
	personDeleted,
	personUpdated,
	personUpdatedStatus,
} from './actionCreators';
import {
	createPerson,
	deletePerson,
	getAllPeople,
	Person,
	StatusUpdateDto,
	updatePerson,
	updatePersonStatus,
} from '../../api/person';
import { errorMessageSet } from '../errorMessage/actionCreators';
import { errorToString } from '../../utils/errorHandling';

export function saveNewPerson(person: Person, cb?: (p: Person) => void) {
	return async function saveNewPersonThunk(dispatch: any, getState: any) {
		try {
			const response = await createPerson(person);
			dispatch(personAdded(response));
			if (cb !== undefined) {
				cb(response);
			}
		} catch (e) {
			console.log('error while adding');
			console.log(e);
			dispatch(errorMessageSet(errorToString(e)));
		}
	};
}

export const getAllPeopleThunk = async (dispatch: any) => {
	try {
		const people = await getAllPeople();
		dispatch(peopleGet(people));
	} catch (e) {
		dispatch(errorMessageSet(errorToString(e)));
	}
};

export function updateAPerson(id: number, person: Person) {
	return async function updatePersonThunk(dispatch: any, getState: any) {
		try {
			const response = await updatePerson(id, person);
			dispatch(personUpdated(response));
		} catch (e) {
			dispatch(errorMessageSet(errorToString(e)));
		}
	};
}

export function updateAPersonStatus(id: number, status: StatusUpdateDto) {
	return async function updatePersonStatusThunk(dispatch: any, getState: any) {
		try {
			const response = await updatePersonStatus(id, status);
			dispatch(personUpdatedStatus(response));
		} catch (e) {
			dispatch(errorMessageSet(errorToString(e)));
		}
	};
}

export function deleteAPerson(id: number) {
	return async function deletePersonThunk(dispatch: any, getState: any) {
		try {
			await deletePerson(id);
			dispatch(personDeleted(id));
		} catch (e) {
			dispatch(errorMessageSet(errorToString(e)));
		}
	};
}
