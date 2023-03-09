import { VALUE_NOT_SET } from '../../utils/constants';

export const roles = [
	{
		id: 0,
		name: 'HOLOVA',
		ukr: 'Голова',
	},
	{
		id: 1,
		name: 'PYSAR',
		ukr: 'Писар_івна',
	},
	{
		id: 2,
		name: 'SKARBNYK',
		ukr: 'Скарбник / Скарбиня',
	},
	{
		id: 3,
		name: 'HR_HEAD',
		ukr: 'Голова HR-відділу',
	},
	{
		id: 4,
		name: 'PR_HEAD',
		ukr: 'Голова PR-відділу',
	},
	{
		id: 5,
		name: 'RAK_MEMBER',
		ukr: 'Член_киня РАК',
	},
	{
		id: 6,
		name: 'RECHNYK',
		ukr: 'Речник / Речниця',
	},
	{
		id: 7,
		name: 'KOMIRNYK',
		ukr: 'Комірник / Комірниця',
	},
	{
		id: 8,
		name: 'KIS',
		ukr: 'КІС',
	},
];

export const getRoleUkr = (role: string | null = null) => {
	// @ts-ignore
	const r = roles.find((r) => r.name === role);
	return r ? r.ukr : VALUE_NOT_SET;
};
