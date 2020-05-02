import { ADD_COURSE, GET_COURSES, ADD_PLOT_PARTS, ADD_COURSE_GROUPS } from '../actions/types.js';

const initialState = {
  course: [],
  plotParts: [],
  courseGroups: [],
};

export default function(state = initialState, action) {
  switch(action.type) {
    case ADD_COURSE:
      return {
        ...state,
        course: [...state.course, action.payload]
      };
    case ADD_PLOT_PARTS:
      return {
        ...state,
        plotParts: [...state.plotParts, action.payload]
      };
    case ADD_COURSE_GROUPS:
      return {
        ...state,
        courseGroups: [...state.courseGroups, action.payload]
      };
    case GET_COURSES:
      return {
        ...state,
        course: action.payload
      };
    default:
      return state;
  }
}
