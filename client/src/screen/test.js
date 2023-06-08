import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getTasks, updateTask } from "../Redux/Actions/TaskActions.js";

const TaskList = () => {
  const dispatch = useDispatch();

  const [selectedTask, setSelectedTask] = useState(null);
  const [updatedTasks, setUpdatedTasks] = useState({});

  const listTasks = useSelector((state) => state.tasksList);
  const { tasks, loading, error } = listTasks;

  useEffect(() => {
    dispatch(getTasks());
  }, [dispatch]);

  useEffect(() => {
    if (selectedTask) {
      setUpdatedTasks((prevState) => ({
        ...prevState,
        [selectedTask._id]: selectedTask,
      }));
    }
  }, [selectedTask]);

  const handleTaskClick = (task) => {
    setSelectedTask(task);
  };

  const handleCheckboxChange = (task, item, checked) => {
    const updatedTask = { ...task };
    const checklistItem = updatedTask.checklist.find(
      (checklist) => checklist._id === item._id
    );

    if (checklistItem) {
      checklistItem.isChecked = checked;
      setUpdatedTasks((prevState) => ({
        ...prevState,
        [task._id]: updatedTask,
      }));
    }
  };

  const saveChanges = useCallback(() => {
    Object.keys(updatedTasks).forEach((taskId) => {
      const updatedTask = updatedTasks[taskId];
      dispatch(updateTask(taskId, updatedTask));
    });
    setUpdatedTasks({});
  }, [dispatch, updatedTasks]);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (Object.keys(updatedTasks).length > 0) {
        event.preventDefault();
        event.returnValue = "";
        saveChanges();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [updatedTasks, saveChanges]);

  return (
    <div>
      {loading ? (
        <p>Loading tasks...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <>
          <ul>
            {tasks.map((task) => (
              <li key={task._id} onClick={() => handleTaskClick(task)}>
                {task.image}
                {task.title}
                {task.description}
              </li>
            ))}
          </ul>
          {selectedTask && (
            <div>
              <h2>{selectedTask.title}</h2>
              <p>{selectedTask.description}</p>
              <ul>
                {selectedTask.checklist.map((item) => (
                  <li key={item._id}>
                    <input
                      type="checkbox"
                      checked={item.isChecked}
                      onChange={(e) => handleCheckboxChange(selectedTask, item, e.target.checked)}
                    />
                    <label>{item.infoTask}</label>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TaskList;
