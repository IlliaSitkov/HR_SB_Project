import { SET_GOT_DATA } from './actionTypes';

export const gotEventDataSet = (gotData: number) => ({
	type: SET_GOT_DATA,
	payload: gotData,
});
