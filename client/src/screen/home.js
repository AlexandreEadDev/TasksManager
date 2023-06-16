import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTasks, updateTask, createTask } from "../Redux/Actions/TaskActions";
import Header from "../components/header";
import Sidebar from "../components/sidebar";

export default function Home() {
  const dispatch = useDispatch();
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const listTasks = useSelector((state) => state.tasksList);
  const { tasks } = listTasks;

  const [selectedTask, setSelectedTask] = useState(null);
  const [updatedTasks, setUpdatedTasks] = useState({});
  const [filterType, setFilterType] = useState("all");
  const [isModified, setIsModified] = useState(false);
  const [currentCheckedPercent, setCurrentCheckedPercent] = useState(0);
  const [yesterdayCheckedPercent, setYesterdayCheckedPercent] = useState(0);
  const [percentDifference, setPercentDifference] = useState(0);

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

  console.log(currentCheckedPercent);

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

  return (
    <div>
      <Sidebar />
      <Header />

      <div className="home-container">
        <div className="home-header">
          <div className="all-tasks-w">
            <i className="fa-solid fa-list-ul"></i>
            <h3>All Tasks</h3>
            <p>{tasks ? tasks.length : "Loading..."}</p>
            {numberOfNewTasks > 1 && (
              <p>+{numberOfNewTasks}news tasks from yesterday</p>
            )}
            {numberOfNewTasks === 1 && <p>+1 new task from yesterday</p>}
            {numberOfNewTasks === 0 && <p>No news tasks from yesterday</p>}
          </div>
          <div className="in-progress-w">
            <i className="fa-solid fa-percent"></i>
            <h3>In Progress</h3>
            <p>{numberOfInProgressTasks}</p>
            <p>{`${diffSign}${percentDifference.toFixed(
              2
            )}% from yesterday`}</p>
          </div>
          <div className="completed-w">
            <i className="fa-solid fa-check"></i>
            <h3>Completed</h3>
            <p>{numberOfCompletedTasks} tasks completed</p>
          </div>
        </div>

        <div className="home-tasks-list-w">
          <h2>My Tasks</h2>

          <div className="home-add-button-w">
            <button className="home-add-button">
              <i class="fa-solid fa-plus"></i>Add Tasks
            </button>
          </div>

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
                Percentage Checked:
                {displayCheckedPercentage(selectedTask.checklist)}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
