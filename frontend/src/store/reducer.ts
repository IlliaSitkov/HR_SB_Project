import { combineReducers } from 'redux';
import peopleReducer from './people/reducer';

const rootReducer = combineReducers({
	people: peopleReducer
});

export default rootReducer;
