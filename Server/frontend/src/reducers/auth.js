import { REGISTER_SUCCESS, REGISTER_FAIL } from '../actions/types.js';

const initialState = {

}

export default function(state = initialState, action) {
  switch(action.type) {
    case REGISTER_SUCCESS:
      return {
        ...state,
        ...action.payload,
      };
    case REGISTER_FAIL:
      return {
        ...state,
      };
    default:
      return state;
  }
}