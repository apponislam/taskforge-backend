import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { Request, Response } from "express";
import { TaskServices } from "./task.services";

const createTask = catchAsync(async (req: Request, res: Response) => {
    // @ts-ignore
    const userId = req.user?._id;
    const result = await TaskServices.createTask(req.body, userId);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Task created successfully",
        data: result,
    });
});

const getAllTasks = catchAsync(async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const searchTerm = Array.isArray(req.query.searchTerm) ? req.query.searchTerm[0] : req.query.searchTerm;
    const projectId = Array.isArray(req.query.projectId) ? req.query.projectId[0] : req.query.projectId;
    const status = Array.isArray(req.query.status) ? req.query.status[0] : req.query.status;
    const priority = Array.isArray(req.query.priority) ? req.query.priority[0] : req.query.priority;
    const assignedMember = Array.isArray(req.query.assignedMember) ? req.query.assignedMember[0] : req.query.assignedMember;
    // @ts-ignore
    const userId = req.user?._id;
    // @ts-ignore
    const userRole = req.user?.role;

    const result = await TaskServices.getAllTasks(
        page,
        limit,
        searchTerm as any,
        projectId as any,
        status as any,
        priority as any,
        assignedMember as any,
        userId,
        userRole
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Tasks fetched successfully",
        meta: result.meta,
        data: result.data,
    });
});

const getTaskById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await TaskServices.getTaskById(id as string);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Task fetched successfully",
        data: result,
    });
});

const updateTask = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    // @ts-ignore
    const userId = req.user?._id;
    // @ts-ignore
    const userRole = req.user?.role;
    console.log('task.controller.ts updateTask: req.user =', req.user);
    console.log('task.controller.ts updateTask: userId =', userId, ', userRole =', userRole);
    const result = await TaskServices.updateTask(id as string, req.body, userId, userRole);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Task updated successfully",
        data: result,
    });
});

const deleteTask = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    await TaskServices.deleteTask(id as string);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Task deleted successfully",
        data: null,
    });
});

const getMemberWorkload = catchAsync(async (req: Request, res: Response) => {
    const { memberId } = req.params;
    const result = await TaskServices.getMemberWorkload(memberId as string);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Member workload fetched successfully",
        data: result,
    });
});

export const TaskControllers = {
    createTask,
    getAllTasks,
    getTaskById,
    updateTask,
    deleteTask,
    getMemberWorkload,
};
