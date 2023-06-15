// tasksActions.js
import axios from "axios";
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

export const updateTask =
  (taskId, updatedTask) => async (dispatch, getState) => {
    try {
      dispatch({ type: UPDATE_TASK_REQUEST });

      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.put(
        `/api/tasks/${taskId}`,
        updatedTask,
        config
      );

      dispatch({
        type: UPDATE_TASK_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: UPDATE_TASK_FAILURE,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

export const createTask = (newTask) => async (dispatch) => {
  try {
    // Dispatch an action to indicate the creation request
    dispatch({ type: CREATE_TASK_REQUEST });

    // Make an API request to create a new task
    const response = await axios.post("/api/tasks", newTask);

    // Dispatch an action with the newly created task
    dispatch({ type: CREATE_TASK_SUCCESS, payload: response.data });

    // Refresh the tasks list
    dispatch(getTasks());
  } catch (error) {
    // Dispatch an action to indicate the creation failure
    dispatch({
      type: CREATE_TASK_FAILURE,
      payload: error.response.data.message,
    });
  }
};
