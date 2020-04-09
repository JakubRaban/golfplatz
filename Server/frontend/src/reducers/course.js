import { ADD_COURSE } from '../actions/types.js';

const initialState = {
  course: []
}

export default function(state = initialState, action) {
  switch(action.type) {
    case ADD_COURSE:
      return {
        ...state,
        course: [...state.course, action.payload]
      }
    default:
      return state;
  }
}
