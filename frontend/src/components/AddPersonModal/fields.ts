import { Statuses } from '../../api/person';

export const statusToNecessaryFields: Map<Statuses, string[]> = new Map<
	Statuses,
	string[]
>();
statusToNecessaryFields.set(Statuses.NEWCOMER, [
	'name',
	'surname',
	'faculty',
	'specialty',
	'yearEnter',
	'email',
	'telegram',
	'status',
	'about',
	'dateFillForm',
]);
statusToNecessaryFields.set(Statuses.MALIUK, [
	'name',
	'surname',
	'faculty',
	'specialty',
	'yearEnter',
	'email',
	'telegram',
	'status',
	'about',
	'dateFillForm',
]);
statusToNecessaryFields.set(Statuses.BRATCHYK, [
	'name',
	'surname',
	'faculty',
	'specialty',
	'yearEnter',
	'email',
	'telegram',
	'status',
	'dateBirth',
	'telephone',
	'role',
	'parent',
	'dateVysviata',
]);
statusToNecessaryFields.set(Statuses.POSHANOVANYI, [
	'name',
	'surname',
	'status',
]);
statusToNecessaryFields.set(Statuses.EX_BRATCHYK, [
	'name',
	'surname',
	'status',
	'parent',
	'dateExclusion',
]);

export const statusToOptionalFields: Map<Statuses, string[]> = new Map<
	Statuses,
	string[]
>();
statusToOptionalFields.set(Statuses.NEWCOMER, [
	'parental',
	'dateBirth',
	'facebook',
	'telephone',
]);
statusToOptionalFields.set(Statuses.MALIUK, [
	'parental,',
	'avatar,',
	'dateBirth,',
	'facebook,',
	'telephone,',
	'parent',
]);
statusToOptionalFields.set(Statuses.BRATCHYK, [
	'parental',
	'avatar',
	'facebook',
	'about',
]);
statusToOptionalFields.set(Statuses.POSHANOVANYI, [
	'parental',
	'avatar',
	'dateBirth',
	'faculty',
	'specialty',
	'facebook',
	'email',
	'telephone',
	'telegram',
	'parent',
	'generation',
	'about',
	'datePoshanuvannia',
]);
statusToOptionalFields.set(Statuses.EX_BRATCHYK, [
	'parental',
	'avatar',
	'dateBirth',
	'faculty',
	'specialty',
	'facebook',
	'email',
	'telephone',
	'telegram',
	'generation',
	'about',
]);
