import { HOME_ROUTE } from './routesNames';

import { HomePage } from '../pages';
import { MainLayout } from '../components/layout';
import { NonIndexRouteObject } from 'react-router-dom';
import AuthWrapper from '../components/auth/AuthWrapper';

export const routes: NonIndexRouteObject[] = [
	{
		path: HOME_ROUTE,
		element: (
			<AuthWrapper>
				<MainLayout />
			</AuthWrapper>
		),
		children: [
			{
				path: '',
				element: <HomePage />,
			},
		],
	},
];
