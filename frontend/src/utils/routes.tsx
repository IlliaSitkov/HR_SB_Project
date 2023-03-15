import { HOME_ROUTE } from './routesNames';
import { HomePage } from '../pages';
import { MainLayout } from '../components/layout';
import { NonIndexRouteObject } from 'react-router-dom';
// import AuthWrapper from '../components/auth/AuthWrapper';
import { UserActivities } from '../components/UserActivities/UserActivities';
//import {PeopleManagerDemo} from '../PeopleManagerDemo';
//import {PersonProfile} from '../components/PersonProfile/PersonProfile';

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
			/*{
        path: '/people/:personId',
        element: <PersonProfile/>
      },
      {
        path: '/people',
        element: <PeopleManagerDemo/>
      }*/
		],
	},
];
