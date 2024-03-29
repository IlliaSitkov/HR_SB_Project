import { combineReducers } from 'redux';
import peopleReducer from './people/reducer';
import eventsReducer from './events/reducer';
import { userReducer } from './user/reducer';
import errorMessageReducer from './errorMessage/reducer';
import gotDataReducer from './gotData/reducer';
import { eventActivitiesReducer } from './eventActivities/reducer';
import gotEventsDataReducer from './gotEventData/reducer';

const rootReducer = combineReducers({
	people: peopleReducer,
	allEvents: eventsReducer,
	user: userReducer,
	errorMessage: errorMessageReducer,
	gotData: gotDataReducer,
	gotEventsData: gotEventsDataReducer,
	eventActivities: eventActivitiesReducer,
});

export default rootReducer;
