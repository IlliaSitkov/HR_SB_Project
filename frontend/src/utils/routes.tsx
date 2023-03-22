import { HOME_ROUTE } from './routesNames';
import { MainLayout } from '../components/layout';
import { NonIndexRouteObject } from 'react-router-dom';
// import AuthWrapper from '../../components/auth/AuthWrapper';
import { UserActivities } from '../components/UserActivities/UserActivities';
import { PersonProfile } from '../components/PersonProfile/PersonProfile';
import { MyProfile } from '../components/MyProfile/MyProfile';
import { PeopleList } from '../components/PeopleList/PeopleList';
import { EventsList } from '../components/EventsList/EventsList';
import NearestBirthdays from '../components/NearestBritdays/NearestBirthdays';
import { ItemManagerDemo } from '../ItemManagerDemo';
import { ActivityManager } from '../components/ActivityManager/ActivityManager';
import {
	AuthenticatedTemplate,
	UnauthenticatedTemplate,
} from '@azure/msal-react';
import { SynchronizeBirthdaysButton } from '../components/SynchronizeBirthdays/SynchronizeBirthdays';
import PrivateRoute from '../components/PrivateRoute/PrivateRoute';

export const routes: NonIndexRouteObject[] = [
	{
		path: HOME_ROUTE,
		element: <MainLayout />,
		children: [
			{
				path: '/',
				element: (
					<>
						<UnauthenticatedTemplate>
							You need to authorize before using the system
						</UnauthenticatedTemplate>
						<AuthenticatedTemplate>Welcome to the HR SB</AuthenticatedTemplate>
					</>
				),
			},
			{
				path: '/events',
				element: (
					<PrivateRoute>
						<ActivityManager eventId={1} />
					</PrivateRoute>
				),
			},
			{
				path: '/acts',
				element: (
					<PrivateRoute>
						<UserActivities personId={13} />
					</PrivateRoute>
				),
			},
			{
				path: '/members/:memberId',
				element: (
					<PrivateRoute>
						<PersonProfile />
					</PrivateRoute>
				),
			},
			{
				path: '/members',
				element: (
					<PrivateRoute>
						<PeopleList />
					</PrivateRoute>
				),
			},
			{
				path: '/members',
				element: <EventsList />,
			},
			{
				path: '/profile',
				element: (
					<PrivateRoute>
						<MyProfile />
					</PrivateRoute>
				),
			},
			{
				path: '/birthdays',
				element: (
					<PrivateRoute>
						<AuthenticatedTemplate>
							<div className='mt-3'>
								<NearestBirthdays />
								<div className='mt-5 d-flex justify-content-center'>
									<SynchronizeBirthdaysButton />
								</div>
							</div>
						</AuthenticatedTemplate>
					</PrivateRoute>
				),
			},
			{
				path: '/items',
				element: (
					<PrivateRoute>
						<ItemManagerDemo />
					</PrivateRoute>
				),
			},
		],
	},
];
