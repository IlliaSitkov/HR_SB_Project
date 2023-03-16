export enum Statuses {
	NEWCOMER = 'NEWCOMER',
	MALIUK = 'MALIUK',
	BRATCHYK = 'BRATCHYK',
	POSHANOVANYI = 'POSHANOVANYI',
	EX_BRATCHYK = 'EX_BRATCHYK',
}

export const statusesColorful = {
	NEWCOMER: {
		ukr: 'Новенький',
		color: '#b8e4f9',
	},
	MALIUK: {
		ukr: 'Малюк',
		color: '#bdf7e4',
	},
	BRATCHYK: {
		ukr: 'Братчик',
		color: '#e9c2f2',
	},
	POSHANOVANYI: {
		ukr: 'Пошанований',
		color: '#f0d1a8',
	},
	EX_BRATCHYK: {
		ukr: 'Виключений братчик',
		color: '#fcb9d6',
	},
};

export const statusesForDropdown = [
	{
		name: 'NEWCOMER',
		ukrMany: 'Новенькі',
	},
	{
		name: 'MALIUK',
		ukrMany: 'Малюки',
	},
	{
		name: 'BRATCHYK',
		ukrMany: 'Братчики',
	},
	{
		name: 'POSHANOVANYI',
		ukrMany: 'Пошановані',
	},
	{
		name: 'EX_BRATCHYK',
		ukrMany: 'Виключені братчики',
	},
];

export const getStatusUkr = (status: string | null = null) => {
	// @ts-ignore
	const s = statusesColorful[status];
	return s ? s.ukr : 'Статус невідомий';
};

export const getStatusStyle = (status: string | null = null) => {
	// @ts-ignore
	const s = statusesColorful[status];
	const color = s ? s.color : 'white';
	return { background: color };
};