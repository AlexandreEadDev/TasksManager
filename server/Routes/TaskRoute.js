import express from "express";
import asyncHandler from "express-async-handler";
import Task from "../Models/TaskModel.js";
import protect from "../Middleware/authmiddleware.js";

const taskRouter = express.Router();


//CREATE
taskRouter.post(
    "/",
    protect,
    asyncHandler(async (req, res) => {
        try {

            const { title, description } = req.body;

            const task = await Task.create({
                name: req.user.name,
                title,
                description,
                user: req.user._id
            });

            const newTask = await task.save()
            res.status(201).json(newTask)
        } catch (error) {
            res.status(400);
            throw new Error("Invalid User Data");
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