import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import './App.css';
import { AppRouter } from './components';
import { Navbar } from './components/Navbar/Navbar';
import AuthWrapper from './components/auth/AuthWrapper';
import { fetchUserThunk } from './store/user/thunk';

function App() {
	const dispatch = useDispatch();
	dispatch(fetchUserThunk);
	return (
		<AuthWrapper>
			<BrowserRouter>
				<Navbar />
				<AppRouter />
			</BrowserRouter>
		</AuthWrapper>
	);
}

export default App;
