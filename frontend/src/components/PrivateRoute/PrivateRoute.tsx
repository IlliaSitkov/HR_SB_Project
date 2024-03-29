import { FC, ReactElement } from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../../utils/authConfig';
import { UserRole } from '../../api/common/types';
import { useSelector } from 'react-redux';
import { getUserRole } from '../../store/selectors';

const PrivateRoute: FC<{
	children: ReactElement;
	allowedRoles?: UserRole[];
}> = ({ children, allowedRoles }) => {
	if (!allowedRoles)
		allowedRoles = [UserRole.ANONYMOUS, UserRole.USER, UserRole.HR];
	const role = useSelector<UserRole>(getUserRole);

	if (isAuthenticated() && allowedRoles.includes(role as UserRole)) {
		return children;
	} else {
		return <Navigate to='/' />;
	}
};

export default PrivateRoute;
