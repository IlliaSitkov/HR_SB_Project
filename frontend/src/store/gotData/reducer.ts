import { SET_GOT_DATA } from './actionTypes';

// 0 - not yet loaded
// 1 - started loading
// 2 - error while loading
// 3 - loaded successfully
const gotDataInitialState: number = 0;

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