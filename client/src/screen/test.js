import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getTasks, updateTask } from "../Redux/Actions/TaskActions.js";
import { Link } from "react-router-dom";

export default function TaskList() {
  const dispatch = useDispatch();

  const [selectedTask, setSelectedTask] = useState(null);
  const [updatedTasks, setUpdatedTasks] = useState({});
  const [filterType, setFilterType] = useState("all"); // "all", "inProgress", "completed"

  const listTasks = useSelector((state) => state.tasksList);
  const { tasks, loading, error } = listTasks;

  const displayCheckedPercentage = (checklist) => {
    const checkedItems = checklist.filter((item) => item.isChecked);
    const percentage = (checkedItems.length / checklist.length) * 100;
    return `${percentage.toFixed(2)}%`;
  };

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

  const handleLinkClick = useCallback(() => {
    saveChanges();
  }, [saveChanges]);

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

  useEffect(() => {
    dispatch(getTasks());
  }, [dispatch]);

  const filterTasks = () => {
    switch (filterType) {
      case "inProgress":
        return tasks.filter((task) => {
          const checkedPercentage = (task.checklist.filter(
            (item) => item.isChecked
          ).length /
            task.checklist.length) *
            100;
          return checkedPercentage > 0 && checkedPercentage < 100;
        });
      case "completed":
        return tasks.filter((task) => {
          const checkedPercentage = (task.checklist.filter(
            (item) => item.isChecked
          ).length /
            task.checklist.length) *
            100;
          return checkedPercentage === 100;
        });
      default:
        return tasks;
    }
  };

  const handleFilterClick = (type) => {
    setFilterType(type);
  };

  const filteredTasks = filterTasks();

  return (
    <div>
      {loading ? (
        <p>Loading tasks...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <>
          <div>
            <button onClick={() => handleFilterClick("all")}>All Tasks</button>
            <button onClick={() => handleFilterClick("inProgress")}>
              In Progress
            </button>
            <button onClick={() => handleFilterClick("completed")}>
              Completed
            </button>
          </div>
          <ul>
            {filteredTasks.map((task) => (
              <li key={task._id} onClick={() => handleTaskClick(task)}>
                {task.image}
                {task.title}
                {task.description}
                <span>
                  {task.checklist.length > 0 &&
                    `(${displayCheckedPercentage(task.checklist)})`}
                </span>
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
                      onChange={(e) =>
                        handleCheckboxChange(
                          selectedTask,
                          item,
                          e.target.checked
                        )
                      }
                    />
                    <label>{item.infoTask}</label>
                  </li>
                ))}
              </ul>
              <p>
                Percentage Checked:{" "}
                {displayCheckedPercentage(selectedTask.checklist)}
              </p>
            </div>
          )}
        </>
      )}
      <Link to="/" onClick={handleLinkClick}>
        home
      </Link>
    </div>
  );
}
