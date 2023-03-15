import { User, UserRole } from '../../api/common/types';
import { getUserMe } from '../../api/user/user.service';
import { userFetched } from './actionCreators';

export const fetchUserThunk: any = async (dispatch: Function) => {
	try {
		const user: User = await getUserMe();
		console.log('User: ', user);
		dispatch(userFetched(user));
	} catch (e) {
		console.log('error: ', e);
		dispatch(userFetched({ role: UserRole.ANONYMOUS }));
	}
};
