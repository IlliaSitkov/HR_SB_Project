import {
	personAdded,
	personDeleted,
	personUpdated,
	personUpdatedStatus,
} from './actionCreators';
import {
	createPerson,
	updatePerson,
	updatePersonStatus,
	deletePerson,
	Person,
	StatusUpdateDto,
} from '../../api/person';

export function saveNewPerson(person: Person) {
	return async function saveNewPersonThunk(dispatch: any, getState: any) {
		const response = await createPerson(person);
		dispatch(personAdded(response));
	};
}

export function updateAPerson(id: number, person: Person) {
	return async function updatePersonThunk(dispatch: any, getState: any) {
		const response = await updatePerson(id, person);
		dispatch(personUpdated(response));
	};
}

export function updateAPersonStatus(id: number, status: StatusUpdateDto) {
	return async function updatePersonStatusThunk(dispatch: any, getState: any) {
		const response = await updatePersonStatus(id, status);
		dispatch(personUpdatedStatus(response));
	};
}

export function deleteAPerson(id: number) {
	return async function deletePersonThunk(dispatch: any, getState: any) {
		const response = await deletePerson(id);
		dispatch(personDeleted(id));
	};
}
