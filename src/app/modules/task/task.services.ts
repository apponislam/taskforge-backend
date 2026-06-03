import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import { Task } from "./task.model";
import { ITask, TaskStatus, TaskPriority } from "./task.interface";
import { Project } from "../project/project.model";
import { ActivityLog } from "../activity/activity.model";
import mongoose from "mongoose";

const createTask = async (payload: ITask, userId: string) => {
    // Verify project exists
    const project = await Project.findById(payload.projectId);
    if (!project) {
        throw new ApiError(httpStatus.NOT_FOUND, "Project not found");
    }

    // 1. Prevent duplicate task titles in same project
    const existingTask = await Task.findOne({ title: payload.title, projectId: payload.projectId });
    if (existingTask) {
        throw new ApiError(httpStatus.BAD_REQUEST, "This task already exists in the project");
    }

    // 2. Prevent setting past dates as deadlines
    if (payload.dueDate < new Date()) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Please select a valid deadline - cannot be in past");
    }

    const taskData = {
        ...payload,
        createdBy: new mongoose.Types.ObjectId(userId),
    };

    const newTask = await (await Task.create(taskData)).populate("projectId assignedMember createdBy");

    let logMessage = `Task "${newTask.title}" created`;
    if (newTask.assignedMember) {
        logMessage += ` and assigned`;
    }
    await ActivityLog.create({ message: logMessage });

    return newTask;
};

const getAllTasks = async (page: number = 1, limit: number = 10, searchTerm?: string, projectId?: string, status?: TaskStatus, priority?: TaskPriority, assignedMember?: string, userId?: string, userRole?: string) => {
    const query: any = {};

    if (searchTerm) {
        query.$or = [{ title: { $regex: searchTerm, $options: "i" } }, { description: { $regex: searchTerm, $options: "i" } }];
    }

    if (projectId) {
        query.projectId = projectId;
    }

    if (status) {
        query.status = status;
    }

    if (priority) {
        query.priority = priority;
    }

    if (assignedMember) {
        query.assignedMember = assignedMember;
    }

    // Filter based on user role
    if (userId && userRole) {
        if (userRole === "team_member") {
            // Team members can only see tasks assigned to them
            query.assignedMember = userId;
        }
    }

    const skip = (page - 1) * limit;
    const tasks = await Task.find(query).populate("projectId assignedMember createdBy").sort({ dueDate: 1 }).skip(skip).limit(limit);

    const total = await Task.countDocuments(query);

    return {
        data: tasks,
        meta: {
            page,
            limit,
            total,
            totalPage: Math.ceil(total / limit),
        },
    };
};

const getTaskById = async (id: string) => {
    const task = await Task.findById(id).populate("projectId assignedMember createdBy");
    if (!task) {
        throw new ApiError(httpStatus.NOT_FOUND, "Task not found");
    }
    return task;
};

const updateTask = async (id: string, payload: Partial<ITask>, userId?: string, userRole?: string) => {
    const task = await Task.findById(id);
    if (!task) {
        throw new ApiError(httpStatus.NOT_FOUND, "Task not found");
    }

    // 3. Team members can only update assigned tasks
    if (userRole === "team_member" && task.assignedMember?.toString() !== userId) {
        throw new ApiError(httpStatus.FORBIDDEN, "You can only update your assigned tasks");
    }

    if (payload.title && payload.title !== task.title) {
        const existingTask = await Task.findOne({
            title: payload.title,
            projectId: task.projectId,
            _id: { $ne: id },
        });
        if (existingTask) {
            throw new ApiError(httpStatus.BAD_REQUEST, "This task already exists in the project");
        }
    }

    if (payload.dueDate && payload.dueDate < new Date()) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Please select a valid deadline - cannot be in past");
    }

    // 4. Prevent assigning completed tasks
    if (payload.assignedMember && task.status === "completed") {
        throw new ApiError(httpStatus.BAD_REQUEST, "Completed tasks cannot be reassigned");
    }

    const oldAssignedMember = task.assignedMember;
    const oldStatus = task.status;
    const taskTitle = task.title;

    const updatedTask = await Task.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    }).populate("projectId assignedMember createdBy");

    if (!updatedTask) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to update task");
    }

    // Log appropriate activity
    if (payload.status && payload.status !== oldStatus) {
        await ActivityLog.create({
            message: `Task "${taskTitle}" marked as ${payload.status}`,
        });
    } else if (payload.assignedMember && String(payload.assignedMember) !== oldAssignedMember?.toString()) {
        await ActivityLog.create({
            message: `Task "${taskTitle}" assigned`,
        });
    } else {
        await ActivityLog.create({
            message: `Task "${taskTitle}" updated`,
        });
    }

    return updatedTask;
};

const deleteTask = async (id: string) => {
    const task = await Task.findById(id);
    if (!task) {
        throw new ApiError(httpStatus.NOT_FOUND, "Task not found");
    }

    await Task.findByIdAndDelete(id);

    await ActivityLog.create({
        message: `Task "${task.title}" deleted`,
    });

    return null;
};

const getMemberWorkload = async (memberId: string) => {
    const totalTasks = await Task.countDocuments({ assignedMember: memberId });
    const completedTasks = await Task.countDocuments({ assignedMember: memberId, status: "completed" });
    const pendingTasks = totalTasks - completedTasks;

    return {
        totalTasks,
        completedTasks,
        pendingTasks,
    };
};

export const TaskServices = {
    createTask,
    getAllTasks,
    getTaskById,
    updateTask,
    deleteTask,
    getMemberWorkload,
};
