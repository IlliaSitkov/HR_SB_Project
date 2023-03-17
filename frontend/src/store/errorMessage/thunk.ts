import { errorMessageSet } from './actionCreators';

export function setNewErrorMessage(errorMessage: string) {
    return async function setNewErrorMessageThunk(dispatch: any, getState: any) {
        dispatch(errorMessageSet(errorMessage));
    };
}