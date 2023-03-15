import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store/store';
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
				<Provider store={store}>
					<Navbar />
					<AppRouter />
				</Provider>
			</BrowserRouter>
		</AuthWrapper>
	);
}

export default App;
