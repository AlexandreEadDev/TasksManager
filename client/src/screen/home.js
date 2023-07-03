import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getTasks,
  updateTask,
  createTask,
  deleteTask,
} from "../Redux/Actions/TaskActions";
import Header from "../components/header";
import Sidebar from "../components/sidebar";
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
import Calendar from "../components/Home/Calendar.js";
import ProgressBar from "@ramonak/react-progress-bar";
import { CSSTransition } from "react-transition-group";

export default function Home() {
  const dispatch = useDispatch();
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const listTasks = useSelector((state) => state.tasksList);
  const { tasks } = listTasks;

  const [selectedTask, setSelectedTask] = useState(null);
  const [animateTask, setAnimateTask] = useState(false);
  const [animateAdd, setAnimateAdd] = useState(false);
  const [updatedTasks, setUpdatedTasks] = useState({});
  const [filterType, setFilterType] = useState("all");
  const [isModified, setIsModified] = useState(false);
  const [currentCheckedPercent, setCurrentCheckedPercent] = useState(0);
  const [yesterdayCheckedPercent, setYesterdayCheckedPercent] = useState(0);
  const [percentDifference, setPercentDifference] = useState(0);
  const [image, setImage] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [checklistItem, setChecklistItem] = useState("");

  useEffect(() => {
    dispatch(getTasks());
  }, [dispatch]);

  const newTasks = tasks.filter((task) => {
    const createdAt = new Date(task.createdAt);
    return createdAt >= yesterday && createdAt < today;
  });

  const numberOfNewTasks = newTasks.length;

  const inProgressTasks = tasks.filter((task) => {
    const hasUnchecked = task.checklist.some((item) => !item.isChecked);
    const hasChecked = task.checklist.some((item) => item.isChecked);
    return hasUnchecked && hasChecked;
  });

  const numberOfInProgressTasks = inProgressTasks.length;

  const displayCheckedPercentage = (checklist) => {
    const checkedItems = checklist.filter((item) => item.isChecked);
    const percentage = (checkedItems.length / checklist.length) * 100;
    return percentage.toFixed(2);
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
    setAnimateTask(true);
    setAnimateAdd(false);
  };
  const handleTaskHide = () => {
    setAnimateTask(false);
  };
  useEffect(() => {
    if (selectedTask) {
      setAnimateTask(true);
    }
  }, [selectedTask]);

  const handleClickAdd = () => {
    if (animateAdd === false) {
      setAnimateTask(false);
      setAnimateAdd(true);
    } else {
      setAnimateAdd(false);
    }
    console.log(animateAdd);
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
    setSelectedTask(null);
  };

  const filteredTasks = filterTasks();

  const getTotalChecklistItems = () => {
    let totalItems = 0;
    let checkedItems = 0;

    tasks.forEach((task) => {
      task.checklist.forEach((item) => {
        totalItems++;
        if (item.isChecked) {
          checkedItems++;
        }
      });
    });

    return { totalItems, checkedItems };
  };

  const { totalItems, checkedItems } = getTotalChecklistItems();

  useEffect(() => {
    const newCheckedPercent = (checkedItems / totalItems) * 100;
    setCurrentCheckedPercent(newCheckedPercent);
  }, [totalItems, currentCheckedPercent]);

  useEffect(() => {
    const calculateCheckedPercent = () => {
      const newCheckedPercent = (checkedItems / totalItems) * 100;
      setCurrentCheckedPercent(newCheckedPercent);
    };

    // Recalculate checked percentage whenever checkedItems or totalItems change
    calculateCheckedPercent();

    // Retrieve yesterdayCheckedPercent from localStorage
    const storedYesterdayCheckedPercent = localStorage.getItem(
      "yesterdayCheckedPercent"
    );

    if (storedYesterdayCheckedPercent) {
      // Use the stored value if available
      setYesterdayCheckedPercent(parseFloat(storedYesterdayCheckedPercent));
    } else {
      // Use a default value for testing purposes
      const defaultYesterdayCheckedPercent = 0.0; // Set your desired default value here
      setYesterdayCheckedPercent(defaultYesterdayCheckedPercent);
    }

    // Calculate and save yesterday's checked percentage at midnight
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);
    const timeUntilMidnight = midnight - new Date();

    let timeoutId;

    const intervalId = setInterval(() => {
      // Save the currentCheckedPercent as yesterdayCheckedPercent at midnight
      localStorage.setItem(
        "yesterdayCheckedPercent",
        currentCheckedPercent.toString()
      );

      // Clear previous timeout if exists
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      // Delayed calculation of checked percentage
      timeoutId = setTimeout(() => {
        if (isNaN(checkedItems) || isNaN(totalItems) || totalItems === 0) {
          // Handle NaN or 0 values, set currentCheckedPercent to 0 or default value
          setCurrentCheckedPercent(0);
        } else {
          calculateCheckedPercent();
        }
      }, 500);
    }, timeUntilMidnight);

    // Clean up the interval and timeout on unmount
    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, [checkedItems, totalItems]);

  useEffect(() => {
    const diff = currentCheckedPercent - yesterdayCheckedPercent;
    setPercentDifference(diff);
  }, [currentCheckedPercent, yesterdayCheckedPercent]);

  const diffSign = percentDifference > 0 ? "+" : "";

  const completedTasks = tasks.filter((task) => {
    const checkedPercentage =
      (task.checklist.filter((item) => item.isChecked).length /
        task.checklist.length) *
      100;
    return checkedPercentage === 100;
  });

  const numberOfCompletedTasks = completedTasks.length;

  const handleButtonSaveClick = () => {
    // Check if all fields are filled
    if (image && title) {
      // Create a new task object
      const newTask = {
        image,
        title,
        description,
        deadline,
      };

      dispatch(createTask(newTask));

      // Clear the input fields
      setImage("");
      setTitle("");
      setDescription("");
      setDeadline("");

      // Hide the input fields
    }
  };

  const handleAddChecklistItem = () => {
    if (selectedTask) {
      const updatedTask = { ...selectedTask };
      updatedTask.checklist.push({ infoTask: checklistItem, isChecked: false });
      setUpdatedTasks((prevState) => ({
        ...prevState,
        [selectedTask._id]: updatedTask,
      }));
      setIsModified(true);
      setChecklistItem("");
    }
  };

  const handleDeleteTask = (taskId) => {
    // Dispatch the deleteTask action with the task ID
    dispatch(deleteTask(taskId));
  };

  const handleContextMenuClick = (taskId, action) => {
    if (action === "modify") {
      // Handle the modify action here
      // Implement your logic for modifying the task
    } else if (action === "delete") {
      handleDeleteTask(taskId);
    }
  };

  return (
    <div>
      <Sidebar />
      <Header />

      <div className="home-container">
        <div className="home-header">
          <div className="all-tasks-w">
            <div className="all-tasks-title">
              <i class="fa-solid fa-list"></i>
              <h3>All Tasks</h3>
            </div>

            <div className="all-tasks-info">
              <p className="all-tasks-number">
                {tasks ? tasks.length : "Loading..."}
              </p>
              {numberOfNewTasks > 1 && (
                <p className="all-tasks-info-news">
                  +{numberOfNewTasks} news tasks from yesterday
                </p>
              )}
              {numberOfNewTasks === 1 && <p>+1 new task from yesterday</p>}
              {numberOfNewTasks === 0 && <p>+0 new task from yesterday</p>}
            </div>
          </div>

          <div className="in-progress-w">
            <div className="in-progress-title">
              <i className="fa-solid fa-percent"></i>
              <h3>In Progress</h3>
            </div>

            <div className="in-progress-info">
              <p className="in-progress-number">{numberOfInProgressTasks}</p>
              <p>{`${diffSign}${percentDifference.toFixed(
                2
              )}% progress from yesterday`}</p>
            </div>
          </div>

          <div className="completed-w">
            <div className="completed-title">
              <i className="fa-solid fa-check"></i>
              <h3>Completed</h3>
            </div>

            <p className="completed-info">
              <p className="completed-number">{numberOfCompletedTasks}</p>{" "}
              <p> tasks completed</p>
            </p>
          </div>
        </div>

        <div className="home-task-container">
          <div className="home-add-w">
            <h2>My Tasks</h2>
            <div className="home-add-btn" onClick={handleClickAdd}>
              <i class="fa-solid fa-plus"></i>
              <button>Add Task</button>
            </div>
          </div>

          <div
            className={`home-add-task-form ${
              animateAdd ? "show slide-in" : "hide"
            }`}
          >
            <h2>Add Task</h2>
            <div className="form-group">
              <label htmlFor="image">Image:</label>
              <input
                type="text"
                id="image"
                value={image}
                onChange={(e) => setImage(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="title">Title:</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description:</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>
            <div className="form-group">
              <label htmlFor="deadline">Deadline:</label>
              <input
                type="date"
                id="deadline"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>
            <button onClick={handleButtonSaveClick}>Save</button>
          </div>

          <div className="home-filter-btn">
            <button
              style={{ color: filterType === "all" ? "black" : "#929292" }}
              onClick={() => handleFilterClick("all")}
            >
              All Tasks
            </button>
            <button
              style={{
                color: filterType === "inProgress" ? "black" : "#929292",
              }}
              onClick={() => handleFilterClick("inProgress")}
            >
              In Progress
            </button>
            <button
              style={{
                color: filterType === "completed" ? "black" : "#929292",
              }}
              onClick={() => handleFilterClick("completed")}
            >
              Completed
            </button>
          </div>

          <div className="home-tasks-list-w">
            <ul className="scrollable-list">
              {filteredTasks.map((task) => (
                <ContextMenuTrigger
                  id={`taskContextMenu-${task._id}`}
                  key={task._id}
                >
                  <li onClick={() => handleTaskClick(task)}>
                    <div className="task-title-container">
                      <span className="task-image"> {task.image}</span>
                      <div className="task-title-w">
                        <span className="task-title"> {task.title}</span>
                        <span className="task-description">
                          {task.description}
                        </span>
                      </div>
                    </div>

                    <span className="task-percents">
                      {task.checklist.length > 0 ? (
                        <>
                          <div className="task-percent-progress">
                            <span>Progress</span>
                            {`${displayCheckedPercentage(task.checklist)}%`}
                          </div>
                          <ProgressBar
                            completed={displayCheckedPercentage(task.checklist)}
                            bgColor="#FE875D"
                            height="0.25rem"
                            isLabelVisible={false}
                            baseBgColor="#FFC6B1"
                            maxCompleted={100}
                          />
                        </>
                      ) : (
                        <>
                          No Tasks
                          <ProgressBar
                            completed={0}
                            bgColor="#FE875D"
                            height="0.25rem"
                            isLabelVisible={false}
                            baseBgColor="#FFC6B1"
                            maxCompleted={100}
                          />
                        </>
                      )}
                    </span>
                  </li>

                  <ContextMenu
                    id={`taskContextMenu-${task._id}`}
                    className="context-menu"
                  >
                    <MenuItem
                      className="context-menu-item"
                      onClick={() => handleContextMenuClick(task._id, "modify")}
                    >
                      Modify
                    </MenuItem>
                    <MenuItem
                      className="context-menu-item"
                      onClick={() => handleContextMenuClick(task._id, "delete")}
                    >
                      Delete
                    </MenuItem>
                  </ContextMenu>
                </ContextMenuTrigger>
              ))}
            </ul>
          </div>

          {selectedTask && (
            <div
              className={`selected-task ${animateTask ? "show" : "hide"}`}
              onAnimationEnd={() => {
                if (!animateTask) {
                  setSelectedTask(null);
                }
              }}
            >
              <button onClick={handleTaskHide}>
                <i className="fa-solid fa-arrow-right"></i>
              </button>
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
                <li>
                  <input
                    type="text"
                    value={checklistItem}
                    onChange={(e) => setChecklistItem(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleAddChecklistItem();
                      }
                    }}
                  />
                </li>
              </ul>
              <p>
                Percentage Checked:{" "}
                {displayCheckedPercentage(selectedTask.checklist)}
              </p>
            </div>
          )}
        </div>

        <div className="sidebar-right-container">
          <Calendar />
        </div>
      </div>
    </div>
  );
}
