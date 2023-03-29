export interface IItem {
	id: number;
	name: string;
}

export enum UserRole {
	ANONYMOUS = 'ANONYMOUS',
	HR = 'HR',
	USER = 'USER',
	NEWCOMER = 'NEWCOMER',
}

export interface User {
	id?: number;
	personId?: number;
	role: UserRole;
}
