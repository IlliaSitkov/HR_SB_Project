import { SET_GOT_DATA } from './actionTypes';
import { GotDataStatus } from '../gotDataEnum';

const gotDataInitialState: number = GotDataStatus.NOT_YET_LOADED;

export default function gotDataReducer(
	state = gotDataInitialState,
	action: any
) {
	switch (action.type) {
		case SET_GOT_DATA: {
			return action.payload;
		}
		default:
			return state;
	}
}
