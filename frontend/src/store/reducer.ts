import { combineReducers } from 'redux';
import peopleReducer from './people/reducer';
import { userReducer } from './user/reducer';

const rootReducer = combineReducers({
	people: peopleReducer,
	user: userReducer,
});

export default rootReducer;
