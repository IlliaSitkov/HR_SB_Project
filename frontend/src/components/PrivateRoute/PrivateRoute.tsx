import { FC, ReactElement } from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../../utils/authConfig';

const PrivateRoute: FC<{ children: ReactElement }> = ({ children }) => {
	if (isAuthenticated()) {
		return children;
	} else {
		return <Navigate to='/' />;
	}
};

export default PrivateRoute;
