import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getTasks, updateTask } from "../Redux/Actions/TaskActions.js";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/header.js";
import { useLocation } from "react-router-dom";

export default function TaskList() {
  const dispatch = useDispatch();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const navigate = useNavigate();

  const [selectedTask, setSelectedTask] = useState(null);
  const [updatedTasks, setUpdatedTasks] = useState({});
  const [filterType, setFilterType] = useState("all"); // "all", "inProgress", "completed"
  const [isModified, setIsModified] = useState(false);

  const listTasks = useSelector((state) => state.tasksList);
  const { tasks, loading, error } = listTasks;

  const displayCheckedPercentage = (checklist) => {
    const checkedItems = checklist.filter((item) => item.isChecked);
    const percentage = (checkedItems.length / checklist.length) * 100;
    return `${percentage.toFixed(2)}%`;
  };

  useEffect(() => {
    const filterQueryParam = queryParams.get("filter");
    if (
      filterQueryParam &&
      ["all", "inProgress", "completed"].includes(filterQueryParam)
    ) {
      setFilterType(filterQueryParam);
    } else {
      setFilterType("all"); // Default value
    }
  }, [queryParams]);

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
      setIsModified(true); // Set isModified to true when checkbox is changed
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

  const filterTasks = () => {
    switch (filterType) {
      case "inProgress":
        return tasks.filter((task) => {
          const checkedPercentage =
            (task.checklist.filter((item) => item.isChecked).length /
              task.checklist.length) *
            100;
          return checkedPercentage > 0 && checkedPercentage < 100;
        });
      case "completed":
        return tasks.filter((task) => {
          const checkedPercentage =
            (task.checklist.filter((item) => item.isChecked).length /
              task.checklist.length) *
            100;
          return checkedPercentage === 100;
        });
      default:
        return tasks;
    }
  };

  const handleFilterClick = (type) => {
    if (isModified) {
      saveChanges(); // Save the changes before switching filter
      setIsModified(false); // Reset isModified to false
    }
    setFilterType(type);
    queryParams.set("filter", type);
    const newSearch = queryParams.toString();
    const newPath = location.pathname + "?" + newSearch;
    dispatch(getTasks());
    navigate(newPath);
  };

  const filteredTasks = filterTasks();

  useEffect(() => {
    dispatch(getTasks());
  }, [dispatch]);

  return (
    <div>
      <Header handleLinkClick={handleLinkClick} />

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
