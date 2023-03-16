import React from 'react';
import { NavLink } from 'react-router-dom';
import { UserRole } from '../../api/common/types';
import './Navbar.css';
import {
	AuthenticatedTemplate,
	UnauthenticatedTemplate,
} from '@azure/msal-react';
import { loginHandle, logoutHandle } from '../../utils/authConfig';
import { useDispatch, useSelector } from 'react-redux';
import { getUserRole } from '../../store/selectors';
import { userFetched } from '../../store/user/actionCreators';

export const Navbar = () => {
	const role = useSelector<UserRole>(getUserRole);

	const dispatch = useDispatch();

	const logout = () => {
		logoutHandle();
		dispatch(userFetched({ role: UserRole.ANONYMOUS }));
	};

	const login = () => {
		loginHandle();
	};

	const tabs = [
		{
			name: 'Люди',
			path: '/members',
			roles: [UserRole.HR],
		},
		{
			name: 'Події',
			path: '/events',
			roles: [UserRole.HR],
		},
		{
			name: 'Профіль',
			path: '/profile',
			roles: [UserRole.HR, UserRole.USER],
		},
		{
			name: 'Приєднатись до СО "Спудейське Братство НаУКМА"',
			path: '/join',
			roles: [UserRole.ANONYMOUS],
		},
	];

	return (
		<>
			<UnauthenticatedTemplate>
				<nav className='menu-bar d-flex justify-content-end'>
					<div>
						<button onClick={login} className='btn-bordered'>
							Увійти
						</button>
					</div>
				</nav>
			</UnauthenticatedTemplate>
			<AuthenticatedTemplate>
				<nav className='menu-bar d-flex justify-content-between align-items-center'>
					<div className='d-flex gap-4'>
						{tabs
							.filter((tab) => tab.roles.includes(role as UserRole))
							.map((tab) => (
								<NavLink
									key={tab.path}
									className={({ isActive }) =>
										`${isActive ? 'tab-selected' : ''}`
									}
									to={tab.path}
								>
									<span className='tab-name'>{tab.name}</span>
								</NavLink>
							))}
					</div>
					<div>
						<button onClick={logout} className='btn-bordered'>
							Вийти
						</button>
					</div>
				</nav>
			</AuthenticatedTemplate>
		</>
	);
};
