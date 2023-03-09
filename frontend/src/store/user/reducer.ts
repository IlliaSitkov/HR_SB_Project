import { User, UserRole } from '../../api/common/types';
import { USER_FETCHED } from './actionTypes';

const userInitialState: User = { role: UserRole.ANONYMOUS };

export const userReducer = (state: User = userInitialState, action: any) => {
	switch (action.type) {
		case USER_FETCHED:
			return action.payload.user;
		default:
			return state;
	}
};
