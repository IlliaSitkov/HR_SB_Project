import { User } from '../../api/common/types';
import { USER_FETCHED } from './actionTypes';

export const userFetched = (user: User) => {
	return {
		type: USER_FETCHED,
		payload: {
			user,
		},
	};
};
