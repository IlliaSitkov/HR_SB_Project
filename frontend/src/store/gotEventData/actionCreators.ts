import { SET_GOT_EVENTS_DATA } from './actionTypes';

export const gotEventDataSet = (gotData: number) => ({
	type: SET_GOT_EVENTS_DATA,
	payload: gotData,
});
