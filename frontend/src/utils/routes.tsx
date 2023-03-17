import { HOME_ROUTE } from './routesNames';
import { HomePage } from '../pages';
import { MainLayout } from '../components/layout';
import { NonIndexRouteObject } from 'react-router-dom';
// import AuthWrapper from '../components/auth/AuthWrapper';
import { UserActivities } from '../components/UserActivities/UserActivities';
import { PersonProfile } from '../components/PersonProfile/PersonProfile';
import { MyProfile } from '../components/MyProfile/MyProfile';
import { PeopleList } from '../components/PeopleList/PeopleList';
import NearestBirthdays from '../components/NearestBritdays/NearestBirthdays';

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
				element: <NearestBirthdays />,
			},
		],
	},
];
