import {RoleEnum} from '../utils/enum/Role.enum';

export interface User {
    id: number,
    personId: number,
    role: RoleEnum
}

export interface UserOptionalUpdate {
    id: number,
    personId?: number,
    role?: RoleEnum
}

export type UserAdd = Pick<User, 'personId' | 'role'>;
export type UserUpdateByPersonId = UserAdd;
