import { Faculty } from '../faculty';
import { Specialty } from '../specialty';
import { Generation } from '../generation';

export interface StatusUpdateDto {
	oldStatus: string;
	newStatus: string;
	date?: Date | null;
}

export interface Person {
	id?: number;
	name: string;
	parental?: string | null;
	surname: string;
	date_birth?: Date | null;
	avatar?: string | null;

	faculty_id?: number | null;
	faculty?: Faculty | null;
	specialty_id?: number | null;
	specialty?: Specialty | null;
	year_enter?: number | null;

	email?: string | null;
	telephone?: string | null;
	telegram?: string | null;
	facebook?: string | null;

	status: string;
	role?: string | null;
	parent_id?: number | null;
	parent?: Person | null;
	generation_id?: number | null;
	generation?: Generation | null;
	about?: string | null;

	date_fill_form?: Date | null;
	date_vysviata?: Date | null;
	date_poshanuvannia?: Date | null;
	date_exclusion?: Date | null;
}

export interface PersonBirthday {
	name: string;
	parental: string;
	surname: string;
	birthday: Date;
	email: string;
	avatar: string;
}

export const getFullName = (p: Person) => {
	let parental = '';
	if (p.parental) parental = ' ' + p.parental;
	return p.surname + ' ' + p.name + parental;
};
