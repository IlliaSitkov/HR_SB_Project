import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store/store';

import './App.css';
import { AppRouter } from './components';

function App() {
	return (
		<BrowserRouter>
            <Provider store={store}>
                <AppRouter />
            </Provider>
		</BrowserRouter>
	);
}

export default App;
