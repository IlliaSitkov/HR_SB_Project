import { SET_GOT_DATA } from './actionTypes';

export const gotDataSet = (gotData: number) => ({
	type: SET_GOT_DATA,
	payload: gotData,
});
