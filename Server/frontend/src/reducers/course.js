import { ADD_COURSE, 
        GET_COURSES, 
        GET_COURSE, 
        ADD_PLOT_PARTS, 
        ADD_COURSE_GROUPS,
        ADD_CHAPTER,
        GET_CHAPTER,
        ADD_ADVENTURES,
        START_CHAPTER, 
        ADD_ANSWER, }
from '../actions/types.js';

const initialState = {
  courses: [],
  plotParts: [],
  courseGroups: [],
  courseDetailed: {},
  chapters: [],
  chapterDetailed: {},
  adventures: [],
  chapterTaken: {},
  answerResponse: {},
};

export default function(state = initialState, action) {
  switch(action.type) {
    case ADD_COURSE:
      return {
        ...state,
        courses: [...state.courses, action.payload]
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
        courses: action.payload,
      };
    case GET_COURSE:
      return {
        ...state,
        courseDetailed: action.payload,
      };
    case GET_CHAPTER:
      return {
        ...state,
        chapterDetailed: action.payload,
      };
    case ADD_CHAPTER:
      return {
        ...state,
        chapters: action.payload,
      };
    case ADD_ADVENTURES:
      return {
        ...state,
        adventures: action.payload,
      };
    case START_CHAPTER:
      return {
        ...state,
        chapterTaken: action.payload,
      }
    case ADD_ANSWER:
      return {
        ...state,
        answerResponse: action.payload,
      }
    default:
      return state;
  }
}
