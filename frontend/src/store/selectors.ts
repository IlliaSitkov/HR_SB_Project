import { Person } from '../api/person';
import { UserRole } from '../api/common/types';
import { Activity } from '../api/activity';

export const getPeople = (state: any) => state.people;

export const getOrdinaryMembers = (state: any) =>
	state.people.filter((person: Person) => person.status !== 'POSHANOVANYI');

export const getInvitedMembers = (state: any) =>
	state.people.filter((person: Person) => person.status === 'POSHANOVANYI');

export const getPossibleOrganizers = (eventId: number) => (state: any) => {
	const organizerIds: number[] = getEventActivitiesWithOrganizers(eventId)(
		state
	).map((a: Activity) => a.person_id);
	return getOrdinaryMembers(state).filter(
		(organizer: Person) => !organizerIds.includes(organizer.id!)
	);
};

export const getPossibleGuests = (eventId: number) => (state: any) => {
	const guestIds: number[] = getEventActivitiesWithGuests(eventId)(state).map(
		(a: Activity) => a.person_id
	);
	return getInvitedMembers(state).filter(
		(organizer: Person) => !guestIds.includes(organizer.id!)
	);
};

export const getPeoplePossibleParents = (state: any) =>
	state.people.filter(
		(p: Person) =>
			p.status === 'BRATCHYK' ||
			p.status === 'POSHANOVANYI' ||
			p.status === 'EX_BRATCHYK'
	);
export const getUserRole = (state: any): UserRole | null => state.user?.role;
export const getCurrentUserPersonId = (state: any): number | null =>
	state.user?.personId;
export const getErrorMessage = (state: any) => state.errorMessage;
export const getGotData = (state: any) => state.gotData;
export const getEventsData = (state: any) => state.gotData;

export const getEventActivitiesWithOrganizers =
	(eventId: number) =>
	(state: any): Activity[] =>
		state.eventActivities.filter(
			(a: Activity) =>
				a.event_id === eventId && a.person.status !== 'POSHANOVANYI'
		);

export const getEventActivitiesWithGuests =
	(eventId: number) =>
	(state: any): Activity[] =>
		state.eventActivities.filter(
			(a: Activity) =>
				a.event_id === eventId && a.person.status === 'POSHANOVANYI'
		);

export const getEvents = (state: any) => state.allEvents;
