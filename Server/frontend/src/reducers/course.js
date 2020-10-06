import { ADD_ADVENTURES,
  ADD_ANSWER,
  ADD_CHAPTER,
  ADD_COURSE,
  ADD_COURSE_GROUPS,
  ADD_PLOT_PARTS,
  GET_ADVENTURES,
  GET_CHAPTER,
  GET_COURSE,
  GET_COURSES,
  NEXT_ADVENTURE, START_CHAPTER }
  from '../actions/types.js';

const initialState = {
  courses: [],
  plotParts: [],
  courseGroups: [],
  courseDetailed: {},
  chapters: [],
  chapterDetailed: {},
  adventures: [],
  adventurePart: {},
  paths: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case ADD_COURSE:
      return {
        ...state,
        courses: [...state.courses, action.payload],
      };
    case ADD_PLOT_PARTS:
      return {
        ...state,
        plotParts: [...state.plotParts, action.payload],
      };
    case ADD_COURSE_GROUPS:
      return {
        ...state,
        courseGroups: [...state.courseGroups, action.payload],
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
    case GET_ADVENTURES:
      return {
        ...state,
        adventures: action.payload.adventures,
        paths: action.payload.paths,
      }
    case ADD_ADVENTURES:
      return {
        ...state,
        adventures: action.payload,
      };
    case START_CHAPTER:
    case ADD_ANSWER:
    case NEXT_ADVENTURE:
      return {
        ...state,
        adventurePart: action.payload,
      };
    default:
      return state;
  }
}
