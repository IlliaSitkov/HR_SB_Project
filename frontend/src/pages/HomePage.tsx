import { Button } from 'react-bootstrap';
import {
	AuthenticatedTemplate,
	UnauthenticatedTemplate,
} from '@azure/msal-react';

import { loginHandle, logoutHandle } from '../utils/authConfig';
import { authHost } from '../http';
import { useState } from 'react';
import NearestBirthdays from '../components/NearestBritdays/NearestBirthdays';

const HomePage = () => {
	const [generations, setGenerations] = useState('');

	return (
		<>
			<h1>This is home page</h1>
			<div className='d-flex flex-column justify-content-center'>
				<h2>Get out of here</h2>
				<UnauthenticatedTemplate>
					<Button variant='primary' onClick={() => loginHandle()}>
						Sign in
					</Button>
				</UnauthenticatedTemplate>
				<AuthenticatedTemplate>
					<Button variant='primary' onClick={() => logoutHandle()}>
						Sign out
					</Button>
				</AuthenticatedTemplate>
			</div>
			<AuthenticatedTemplate>
				<Button
					variant='secondary'
					onClick={async () => {
						const s: object = (await authHost.get('/api/generations')).data;
						console.log(s);
						setGenerations(JSON.stringify(s));
					}}
				>
					Api call
				</Button>
				{generations}
			</AuthenticatedTemplate>
			<AuthenticatedTemplate>
				<div className='w-50'>
					<NearestBirthdays />
				</div>
			</AuthenticatedTemplate>
		</>
	);
};

export default HomePage;
