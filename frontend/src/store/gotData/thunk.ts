import { gotDataSet } from './actionCreators';

export function setNewGotData(gotData: number) {
    return async function setNewGotDataThunk(dispatch: any, getState: any) {
        dispatch(gotDataSet(gotData));
    };
}