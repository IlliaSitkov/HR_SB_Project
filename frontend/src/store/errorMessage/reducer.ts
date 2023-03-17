import { SET_ERROR_MESSAGE } from './actionTypes';

const errorMessageInitialState: string = '';

export default function errorMessageReducer(
    state = errorMessageInitialState,
    action: any
) {
    switch (action.type) {
        case SET_ERROR_MESSAGE: {
            return action.payload;
        }
        default:
            return state;
    }
}