// tasksActions.js
import axios from "axios";
import {
    GET_TASKS_REQUEST,
    GET_TASKS_SUCCESS,
    GET_TASKS_FAILURE,
    TASK_UPDATE_REQUEST,
    TASK_UPDATE_FAIL,
    TASK_UPDATE_SUCCESS,
} from "../Constants/TaskConstants.js";

export const getTasks = () => async (dispatch, getState) => {
    try {
        dispatch({ type: GET_TASKS_REQUEST });

        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        const { data } = await axios.get("/api/tasks", config);

        // Filter tasks based on the user ID
        const userTasks = data.filter((task) => task.user === userInfo._id);

        dispatch({ type: GET_TASKS_SUCCESS, payload: userTasks });
    } catch (error) {
        dispatch({
            type: GET_TASKS_FAILURE,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

