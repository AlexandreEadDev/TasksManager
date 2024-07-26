import { createStore, combineReducers, applyMiddleware } from "redux";
import { composeWithDevTools } from "@redux-devtools/extension";
import { thunk } from "redux-thunk"; // use named import
import { userLoginReducer, userRegisterReducer } from "./Reducers/UserReducers";
import {
  createTaskReducer,
  deleteChecklistItemReducer,
  tasksListReducer,
} from "./Reducers/TaskReducers";

const reducer = combineReducers({
  userLogin: userLoginReducer,
  userRegister: userRegisterReducer,
  tasksList: tasksListReducer,
  createTask: createTaskReducer,
  deleteChecklistItem: deleteChecklistItemReducer,
});

const userInfoFromLocalStorage = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : null;

const initialState = {
  userLogin: { userInfo: userInfoFromLocalStorage },
  tasksList: { tasks: [], loading: false, error: null },
};

const middleware = [thunk];

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
