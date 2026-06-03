import mongoose from "mongoose";

export type ProjectStatus = "active" | "completed" | "on_hold";

export interface IProject {
    _id?: string;
    name: string;
    description?: string;
    deadline: Date;
    status: ProjectStatus;
    createdBy: mongoose.Types.ObjectId;
    teamMembers?: mongoose.Types.ObjectId[];
    createdAt?: Date;
    updatedAt?: Date;
}
