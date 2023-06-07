import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getTasks, updateTask } from "../Redux/Actions/TaskActions.js";

const TaskList = () => {
  const dispatch = useDispatch();

  const [selectedTask, setSelectedTask] = useState(null);

  const listTasks = useSelector((state) => state.tasksList);
  const { tasks, loading, error } = listTasks;

  useEffect(() => {
    dispatch(getTasks());
  }, [dispatch]);

  const handleTaskClick = (task) => {
    setSelectedTask(task);
  };

  const handleCheckboxChange = (task, item, checked) => {
    // Check if the task and checklist exist before accessing them
    if (task && task.checklist) {
      const checklistItem = task.checklist.find(
        (checklist) => checklist._id === item._id
      );

      if (checklistItem) {
        // Update the isChecked property based on the checkbox state
        checklistItem.isChecked = checked;
        // Dispatch the updateTask action to save the changes
        dispatch(updateTask(task._id, task));
      }
    }
  };

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
                {task.title}
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
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TaskList;
