/* eslint-disable complexity */
import {
  ADD_ADVENTURES,
  ADD_ANSWER,
  ADD_CHAPTER,
  ADD_COURSE,
  ADD_COURSE_GROUPS,
  ADD_PLOT_PARTS,
  DELETE_ADVENTURE,
  ERRORS,
  EXPORT_CSV,
  GET_ACHIEVEMENTS,
  GET_ADVENTURES,
  GET_CHAPTER,
  GET_COURSE,
  GET_COURSE_GRADES,
  GET_COURSE_STRUCTURE,
  GET_COURSES,
  GET_ALL_RANKS,
  GET_RANK,
  GET_RANKING,
  GET_STUDENT_MARKS,
  GET_SYSTEM_KEY,
  GET_UNCHECKED_GRADES,
  GRADE_MANUAL,
  NEXT_ADVENTURE,
  PATHS_WITH_DESCRIPTIONS,
  START_CHAPTER,
  UPDATE_ADVENTURE, TOGGLE_PLOT_PART_LOCK, DELETE_COURSE, SET_ACTIVE_COURSE, LOGOUT_SUCCESS,
}
  from '../actions/types.js';

const initialState = {
  courses: [],
  plotParts: [],
  courseGroups: [],
  courseDetailed: {},
  courseGrades: {},
  courseUncheckedGrades: {},
  courseStructure: {},
  chapters: [],
  chapterDetailed: {},
  manualGrades: {},
  csv: {},
  errors: {},
  achievements: {},
  adventures: [],
  adventurePart: {},
  paths: [],
  pathsWithDescriptions: {},
  ranks: [],
  ranking: {},
  studentRank: {},
  studentMarks: {},
  systemKey: undefined,
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
    case DELETE_COURSE:
      return {
        ...state,
        courses: [...state.courses.filter((course) => course.id !== action.id)]
      }
    case GET_COURSE_GRADES:
      return {
        ...state,
        courseGrades: action.payload,
      };
    case GET_UNCHECKED_GRADES:
      return {
        ...state,
        courseUncheckedGrades: action.payload,
      };
    case GET_COURSE_STRUCTURE:
      return {
        ...state,
        courseStructure: action.payload,
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
        choices: action.payload.choices,
      };
    case GET_ACHIEVEMENTS:
      return {
        ...state,
        achievements: action.payload,
      };
    case GRADE_MANUAL:
      return {
        ...state,
        manualGrades: action.payload,
      };
    case GET_ALL_RANKS:
      return {
        ...state,
        ranks: action.payload,
      };
    case GET_RANK:
      return {
        ...state,
        studentRank: action.payload,
      };
    case GET_RANKING:
      return {
        ...state,
        ranking: action.payload,
      };
    case GET_STUDENT_MARKS:
      return {
        ...state,
        studentMarks: action.payload,
      };
    case EXPORT_CSV:
      return {
        ...state,
        csv: action.payload,
      };
    case ADD_ADVENTURES:
      return {
        ...state,
        adventures: [...state.adventures, action.payload],
      };
    case PATHS_WITH_DESCRIPTIONS:
      return {
        ...state,
        pathsWithDescriptions: action.payload,
      };
    case UPDATE_ADVENTURE:
      return {
        ...state,
        adventures: [...state.adventures.filter((adventure) => adventure.id !== action.payload.id), action.payload],
      };
    case DELETE_ADVENTURE:
      return {
        ...state,
        adventures: [...state.adventures.filter((adventure) => adventure.id !== action.id)],
      };
    case START_CHAPTER:
    case ADD_ANSWER:
    case NEXT_ADVENTURE:
      return {
        ...state,
        adventurePart: action.payload,
      };
    case TOGGLE_PLOT_PART_LOCK:
      const index = state.courseDetailed.plotParts.findIndex((plotPart) => plotPart.id === action.payload.id);
      const plotParts = [...state.courseDetailed.plotParts];
      plotParts[index] = action.payload;
      return {
        ...state,
        courseDetailed: {
          ...state.courseDetailed,
          plotParts,
        },
      };
    case GET_SYSTEM_KEY:
      return {
        ...state,
        systemKey: action.payload,
      };
    case ERRORS:
      return {
        ...state,
        errors: action.payload,
      };
    case SET_ACTIVE_COURSE:
      return {
        ...state,
        active: action.payload,
      }
    case LOGOUT_SUCCESS:
      return {
        ...state,
        active: undefined,
      }
    default:
      return state;
  }
}
