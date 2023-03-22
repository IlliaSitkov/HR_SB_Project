import { HOME_ROUTE } from './routesNames';
import { MainLayout } from '../components/layout';
import { NonIndexRouteObject } from 'react-router-dom';
// import AuthWrapper from '../components/auth/AuthWrapper';
import { UserActivities } from '../components/UserActivities/UserActivities';
import { PersonProfile } from '../components/PersonProfile/PersonProfile';
import { MyProfile } from '../components/MyProfile/MyProfile';
import { PeopleList } from '../components/PeopleList/PeopleList';
import { EventsList } from '../components/EventsList/EventsList';
import NearestBirthdays from '../components/NearestBritdays/NearestBirthdays';
import { ItemManagerDemo } from '../ItemManagerDemo';
import { ActivityManager } from '../components/ActivityManager/ActivityManager';
import { HomePage } from '../pages';

export const routes: NonIndexRouteObject[] = [
	{
		path: HOME_ROUTE,
		element: <MainLayout />,
		children: [
			{
				path: '',
				element: <HomePage />,
			},
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
				path: '/members',
				element: <EventsList />,
			},
			{
				path: '/profile',
				element: <MyProfile />,
			},
			{
				path: '/birthdays',
				element: <NearestBirthdays />,
			},
			{
				path: '/items',
				element: <ItemManagerDemo />,
			},
		],
	},
];
