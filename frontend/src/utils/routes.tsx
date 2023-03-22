import { HOME_ROUTE } from './routesNames';
import { MainLayout } from '../components/layout';
import { NonIndexRouteObject } from 'react-router-dom';
// import AuthWrapper from '../components/auth/AuthWrapper';
import { UserActivities } from '../components/UserActivities/UserActivities';
import { PersonProfile } from '../components/PersonProfile/PersonProfile';
import { MyProfile } from '../components/MyProfile/MyProfile';
import { PeopleList } from '../components/PeopleList/PeopleList';
import NearestBirthdays from '../components/NearestBritdays/NearestBirthdays';
import { ItemManagerDemo } from '../ItemManagerDemo';
import { ActivityManager } from '../components/ActivityManager/ActivityManager';
import { SynchronizeBirthdaysButton } from '../components/SynchronizeBirthdays/SynchronizeBirthdays';
import { AuthenticatedTemplate } from '@azure/msal-react';

export const routes: NonIndexRouteObject[] = [
	{
		path: HOME_ROUTE,
		element: <MainLayout />,
		children: [
			{
				path: '/events',
				element: <ActivityManager eventId={1} />,
			},
			{
				path: '/acts',
				element: <UserActivities personId={13} />,
			},
			{
				path: '/members/:memberId',
				element: <PersonProfile />,
			},
			{
				path: '/members',
				element: <PeopleList />,
			},
			{
				path: '/profile',
				element: <MyProfile />,
			},
			{
				path: '/birthdays',
				element: (
					<AuthenticatedTemplate>
						<div className='mt-3'>
							<NearestBirthdays />
							<div className='mt-5 d-flex justify-content-center'>
								<SynchronizeBirthdaysButton />
							</div>
						</div>
					</AuthenticatedTemplate>
				),
			},
			{
				path: '/items',
				element: <ItemManagerDemo />,
			},
		],
	},
];
