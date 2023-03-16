import { Person } from '../api/person';
import { User, UserRole } from '../api/common/types';

export const getPeople = (state: any) => state.people;
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
