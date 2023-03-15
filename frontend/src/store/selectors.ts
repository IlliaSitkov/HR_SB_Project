import { UserRole } from '../api/common/types';

export const getPeople = (state: any) => state.people;
export const getUserRole = (state: any): UserRole | null => state.user?.role;
