import { HOME_ROUTE } from './routesNames';
import { MainLayout } from '../components/layout';
import { NonIndexRouteObject } from 'react-router-dom';
import { PersonProfile } from '../components/PersonProfile/PersonProfile';
import { MyProfile } from '../components/MyProfile/MyProfile';
import { PeopleList } from '../components/PeopleList/PeopleList';
import { EventsList } from '../components/EventsList/EventsList';
import NearestBirthdays from '../components/NearestBritdays/NearestBirthdays';
import { ItemManagerDemo } from '../ItemManagerDemo';
import {
	AuthenticatedTemplate,
	UnauthenticatedTemplate,
} from '@azure/msal-react';
import { SynchronizeBirthdaysButton } from '../components/SynchronizeBirthdays/SynchronizeBirthdays';
import PrivateRoute from '../components/PrivateRoute/PrivateRoute';
import JoinForm from '../components/JoinForm/JoinForm';
import { EventProfile } from '../components/EventProfile/EventProfile';
import { HelloPage } from '../components/HelloPage/HelloPage';
import { UserRole } from '../api/common/types';

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
							<HelloPage
								helloText={`Вітаємо!\nДля доступу до системи необхідно автризуватись`}
							/>
						</UnauthenticatedTemplate>
						<AuthenticatedTemplate>
							<HelloPage helloText='Вітаємо в системі HR SB!' />
						</AuthenticatedTemplate>
					</>
				),
			},
			{
				path: '/members/:memberId',
				element: (
					<PrivateRoute allowedRoles={[UserRole.HR]}>
						<PersonProfile />
					</PrivateRoute>
				),
			},
			{
				path: '/members',
				element: (
					<PrivateRoute allowedRoles={[UserRole.HR]}>
						<PeopleList />
					</PrivateRoute>
				),
			},
			{
				path: '/events/:eventId',
				element: (
					<PrivateRoute allowedRoles={[UserRole.HR]}>
						<EventProfile />
					</PrivateRoute>
				),
			},
			{
				path: '/events',
				element: (
					<PrivateRoute allowedRoles={[UserRole.HR]}>
						<EventsList />
					</PrivateRoute>
				),
			},
			{
				path: '/profile',
				element: (
					<PrivateRoute allowedRoles={[UserRole.USER, UserRole.HR]}>
						<MyProfile />
					</PrivateRoute>
				),
			},
			{
				path: '/birthdays',
				element: (
					<PrivateRoute allowedRoles={[UserRole.HR]}>
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
					<PrivateRoute allowedRoles={[UserRole.HR]}>
						<ItemManagerDemo />
					</PrivateRoute>
				),
			},
			{
				path: '/join',
				element: (
					<PrivateRoute>
						<JoinForm />
					</PrivateRoute>
				),
			},
		],
	},
];
