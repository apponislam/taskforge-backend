import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { Request, Response } from "express";
import { ProjectServices } from "./project.services";

const createProject = catchAsync(async (req: Request, res: Response) => {
    // @ts-ignore
    const userId = req.user?._id;
    const result = await ProjectServices.createProject(req.body, userId);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Project created successfully",
        data: result,
    });
});

const getAllProjects = catchAsync(async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const searchTerm = Array.isArray(req.query.searchTerm) ? req.query.searchTerm[0] : req.query.searchTerm;
    const status = Array.isArray(req.query.status) ? req.query.status[0] : req.query.status;
    // @ts-ignore
    const userId = req.user?._id;
    // @ts-ignore
    const userRole = req.user?.role;

    const result = await ProjectServices.getAllProjects(page, limit, searchTerm as any, status as any, userId, userRole);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Projects fetched successfully",
        meta: result.meta,
        data: result.data,
    });
});

const getProjectById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await ProjectServices.getProjectById(id as string);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Project fetched successfully",
        data: result,
    });
});

const updateProject = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await ProjectServices.updateProject(id as string, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Project updated successfully",
        data: result,
    });
});

const deleteProject = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    await ProjectServices.deleteProject(id as string);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Project deleted successfully",
        data: null,
    });
});

const addTeamMember = catchAsync(async (req: Request, res: Response) => {
    const { projectId, memberId } = req.params;
    const result = await ProjectServices.addTeamMember(projectId as string, memberId as string);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Team member added successfully",
        data: result,
    });
});

const removeTeamMember = catchAsync(async (req: Request, res: Response) => {
    const { projectId, memberId } = req.params;
    const result = await ProjectServices.removeTeamMember(projectId as string, memberId as string);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Team member removed successfully",
        data: result,
    });
});

export const ProjectControllers = {
    createProject,
    getAllProjects,
    getProjectById,
    updateProject,
    deleteProject,
    addTeamMember,
    removeTeamMember,
};
