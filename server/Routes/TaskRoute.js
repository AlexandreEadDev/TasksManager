import express from "express";
import asyncHandler from "express-async-handler";
import Task from "../Models/TaskModel.js";
import protect from "../Middleware/authmiddleware.js";

const taskRouter = express.Router();


// CREATE a new task
taskRouter.post(
    "/",
    protect,
    asyncHandler(async (req, res) => {
        try {
            const { image, title, description, checklist, deadline } = req.body;

            const task = await Task.create({
                image,
                title,
                description,
                checklist,
                deadline,
                user: req.user._id,
            });

            res.status(201).json(task);
        } catch (error) {
            res.status(400).json({ message: "Invalid Task Data" });
        }
    })
);



// GET TASKS
taskRouter.get(
    "/",
    protect,
    asyncHandler(async (req, res) => {
        try {
            const tasks = await Task.find({ user: req.user._id });
            res.json(tasks);
        } catch (error) {
            res.status(500).json({ message: "Internal Server Error" });
        }
    })
);

export default taskRouter;