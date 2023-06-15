// taskReducers.js
import {
  GET_TASKS_REQUEST,
  GET_TASKS_SUCCESS,
  GET_TASKS_FAILURE,
  UPDATE_TASK_REQUEST,
  UPDATE_TASK_SUCCESS,
  UPDATE_TASK_FAILURE,
  CREATE_TASK_REQUEST,
  CREATE_TASK_SUCCESS,
  CREATE_TASK_FAILURE,
} from "../Constants/TaskConstants.js";

export const tasksListReducer = (
  state = { tasks: [], loading: false, error: null },
  action
) => {
  switch (action.type) {
    case GET_TASKS_REQUEST:
      return { ...state, loading: true };
    case GET_TASKS_SUCCESS:
      return { ...state, loading: false, tasks: action.payload };
    case GET_TASKS_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case UPDATE_TASK_REQUEST:
      return { ...state, loading: true };
    case UPDATE_TASK_SUCCESS:
      const updatedTasks = state.tasks.map((task) =>
        task._id === action.payload._id ? action.payload : task
      );
      return { ...state, loading: false, tasks: updatedTasks };
    case UPDATE_TASK_FAILURE:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export const createTaskReducer = (
  state = { task: null, loading: false, error: null },
  action
) => {
  switch (action.type) {
    case CREATE_TASK_REQUEST:
      return { ...state, loading: true };
    case CREATE_TASK_SUCCESS:
      return { ...state, loading: false, task: action.payload };
    case CREATE_TASK_FAILURE:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
