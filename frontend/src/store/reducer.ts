import { combineReducers } from 'redux';
import peopleReducer from './people/reducer';
import { userReducer } from './user/reducer';
import errorMessageReducer from './errorMessage/reducer';
import gotDataReducer from './gotData/reducer';
import { eventActivitiesReducer } from './eventActivities/reducer';

const rootReducer = combineReducers({
	people: peopleReducer,
	user: userReducer,
	errorMessage: errorMessageReducer,
	gotData: gotDataReducer,
	eventActivities: eventActivitiesReducer,
});

export default rootReducer;
