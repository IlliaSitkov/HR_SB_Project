import { gotEventDataSet } from './actionCreators';

export function setNewGotData(gotData: number) {
	return async function setNewGotDataThunk(dispatch: any) {
		dispatch(gotEventDataSet(gotData));
	};
}
