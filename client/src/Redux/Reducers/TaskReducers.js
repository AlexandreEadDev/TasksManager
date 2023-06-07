// tasksReducers.js
import {
    GET_TASKS_REQUEST,
    GET_TASKS_SUCCESS,
    GET_TASKS_FAILURE,
    TASK_UPDATE_REQUEST,
    TASK_UPDATE_SUCCESS,
    TASK_UPDATE_FAIL,
} from "../Constants/TaskConstants.js";

export const tasksListReducer = (
    state = { tasks: [], loading: false, error: null },
    action
) => {
    switch (action.type) {
        case GET_TASKS_REQUEST:
            return { ...state, loading: true };
        case GET_TASKS_SUCCESS:
            return { ...state, loading: false, tasksList: action.payload };
        case GET_TASKS_FAILURE:
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};

