import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getTasks } from "../Redux/Actions/TaskActions.js";

const TaskList = () => {
    const dispatch = useDispatch();

    const [selectedTask, setSelectedTask] = useState(null);

    const listTasks = useSelector((state) => state.tasksList);
    const { tasksList, loading, error } = listTasks;

    useEffect(() => {
        dispatch(getTasks());
    }, [dispatch]);

    const handleTaskClick = (task) => {
        setSelectedTask(task);
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
                        {tasksList.map((task) => (
                            <li
                                key={task._id}
                                onClick={() => handleTaskClick(task)}
                            >
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
                                        />
                                        <label>{item.description}</label>
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
