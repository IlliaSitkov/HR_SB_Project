import { SET_ERROR_MESSAGE } from './actionTypes';

export const errorMessageSet = (errorMessage: string) => ({
    type: SET_ERROR_MESSAGE,
    payload: errorMessage,
});