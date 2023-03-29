import { Person, statusesArray } from '../api/person';
import { Event } from '../api/event';

//Example: 'NEWCOMER' < 'BRATCHYK'
export const compareStatuses = (status1: string, status2: string) => {
	const id1 = statusesArray.find((status) => status.val === status1)!.id;
	const id2 = statusesArray.find((status) => status.val === status2)!.id;
	if (id1 < id2) return -1;
	if (id1 > id2) return 1;
	return 0;
};

export const comparePeopleWithoutStatuses = (p1: Person, p2: Person) => {
	const surnamesCompare = p1.surname.localeCompare(p2.surname);
	if (surnamesCompare !== 0) {
		return surnamesCompare;
	}
	return p1.name.localeCompare(p2.name);
};

export const comparePeople = (p1: Person, p2: Person) => {
	const statusCompare = compareStatuses(p1.status, p2.status);
	if (statusCompare !== 0) {
		return statusCompare;
	}
	return comparePeopleWithoutStatuses(p1, p2);
};

export const compareEvents = (e1: Event, e2: Event) => {
	if (e1.date_end > e2.date_end) return -1;
	if (e1.date_end < e2.date_end) return 1;
	return 0;
};
