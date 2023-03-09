/* eslint-disable react-hooks/exhaustive-deps*/
import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { UserRole } from '../../api/common/types';
import './Navbar.css';
import {
	AuthenticatedTemplate,
	UnauthenticatedTemplate,
	useIsAuthenticated,
} from '@azure/msal-react';
import { loginHandle, logoutHandle } from '../../utils/authConfig';
import { useDispatch, useSelector } from 'react-redux';
import { getUserRole } from '../../store/selectors';
import { userFetched } from '../../store/user/actionCreators';
import { fetchUserThunk } from '../../store/user/thunk';

export const Navbar = () => {
	const dispatch = useDispatch();
	const role = useSelector<UserRole>(getUserRole);

	const isAuthenticated = useIsAuthenticated();

	useEffect(() => {
		dispatch(fetchUserThunk);
	}, [isAuthenticated]);

	const logout = () => {
		logoutHandle();
		dispatch(userFetched({ role: UserRole.ANONYMOUS }));
	};

	const login = () => loginHandle();

	const tabs = [
		{
			name: 'Люди',
			path: '/members',
			roles: [UserRole.HR, UserRole.USER],
		},
		{
			name: 'Дні народження',
			path: '/birthdays',
			roles: [UserRole.HR],
		},
		// {
		// 	name: 'Події',
		// 	path: '/events',
		// 	roles: [UserRole.HR, UserRole.USER],
		// },
		// {
		// 	name: 'Профіль',
		// 	path: '/profile',
		// 	roles: [UserRole.HR, UserRole.USER, UserRole.NEWCOMER],
		// },
		// {
		// 	name: 'Приєднатись до СО "Спудейське Братство НаУКМА"',
		// 	path: '/join',
		// 	roles: [UserRole.ANONYMOUS],
		// },
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
				<nav className='menu-bar d-flex justify-content-between align-items-center mb-4 sticky-top'>
					<div className='d-flex gap-2 gap-md-4 gap-lg-4 gap-xl-4 gap-xxl-4'>
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
