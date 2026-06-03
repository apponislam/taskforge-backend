import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import { Project } from "./project.model";
import { IProject, ProjectStatus } from "./project.interface";
import { ActivityLog } from "../activity/activity.model";
import mongoose from "mongoose";

const createProject = async (payload: IProject, userId: string) => {
    const isExist = await Project.findOne({ name: payload.name });
    if (isExist) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Project with this name already exists");
    }

    // Prevent setting past dates as deadlines
    if (payload.deadline < new Date()) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Please select a valid deadline - cannot be in past");
    }

    const projectData = {
        ...payload,
        createdBy: new mongoose.Types.ObjectId(userId),
    };

    const newProject = await (await Project.create(projectData)).populate("createdBy teamMembers");

    await ActivityLog.create({
        message: `Project "${newProject.name}" created`,
    });

    return newProject;
};

const getAllProjects = async (
    page: number = 1,
    limit: number = 10,
    searchTerm?: string,
    status?: ProjectStatus,
    userId?: string,
    userRole?: string
) => {
    const query: any = {};

    if (searchTerm) {
        query.name = { $regex: searchTerm, $options: "i" };
    }

    if (status) {
        query.status = status;
    }

    // Filter based on user role
    if (userId && userRole) {
        if (userRole === "team_member") {
            // Team members can only see projects they are part of
            query.$or = [
                { createdBy: userId },
                { teamMembers: { $in: [userId] } }
            ];
        }
        // Project Managers and Admins can see all projects
    }

    const skip = (page - 1) * limit;
    const projects = await Project.find(query)
        .populate("createdBy teamMembers")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const total = await Project.countDocuments(query);

    return {
        data: projects,
        meta: {
            page,
            limit,
            total,
            totalPage: Math.ceil(total / limit),
        },
    };
};

const getProjectById = async (id: string) => {
    const project = await Project.findById(id).populate("createdBy teamMembers");
    if (!project) {
        throw new ApiError(httpStatus.NOT_FOUND, "Project not found");
    }
    return project;
};

const updateProject = async (id: string, payload: Partial<IProject>) => {
    const project = await Project.findById(id);
    if (!project) {
        throw new ApiError(httpStatus.NOT_FOUND, "Project not found");
    }

    if (payload.name && payload.name !== project.name) {
        const isExist = await Project.findOne({ name: payload.name, _id: { $ne: id } });
        if (isExist) {
            throw new ApiError(httpStatus.BAD_REQUEST, "Project with this name already exists");
        }
    }

    if (payload.deadline && payload.deadline < new Date()) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Please select a valid deadline - cannot be in past");
    }

    const updatedProject = await Project.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    }).populate("createdBy teamMembers");

    await ActivityLog.create({
        message: `Project "${project.name}" updated`,
    });

    return updatedProject;
};

const deleteProject = async (id: string) => {
    const project = await Project.findById(id);
    if (!project) {
        throw new ApiError(httpStatus.NOT_FOUND, "Project not found");
    }

    await Project.findByIdAndDelete(id);

    await ActivityLog.create({
        message: `Project "${project.name}" deleted`,
    });

    return null;
};

const addTeamMember = async (projectId: string, memberId: string) => {
    const project = await Project.findById(projectId);
    if (!project) {
        throw new ApiError(httpStatus.NOT_FOUND, "Project not found");
    }

    if (!project.teamMembers) {
        project.teamMembers = [];
    }

    if (project.teamMembers.includes(memberId as any)) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Member is already part of this project");
    }

    project.teamMembers.push(memberId as any);
    await project.save();

    await ActivityLog.create({
        message: `Member added to project "${project.name}"`,
    });

    return project.populate("createdBy teamMembers");
};

const removeTeamMember = async (projectId: string, memberId: string) => {
    const project = await Project.findById(projectId);
    if (!project) {
        throw new ApiError(httpStatus.NOT_FOUND, "Project not found");
    }

    if (!project.teamMembers) {
        throw new ApiError(httpStatus.BAD_REQUEST, "No team members to remove");
    }

    project.teamMembers = project.teamMembers.filter(id => id.toString() !== memberId);
    await project.save();

    await ActivityLog.create({
        message: `Member removed from project "${project.name}"`,
    });

    return project.populate("createdBy teamMembers");
};

export const ProjectServices = {
    createProject,
    getAllProjects,
    getProjectById,
    updateProject,
    deleteProject,
    addTeamMember,
    removeTeamMember,
};
