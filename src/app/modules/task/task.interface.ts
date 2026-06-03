import mongoose from "mongoose";

export type TaskPriority = "high" | "medium" | "low";
export type TaskStatus = "todo" | "in_progress" | "completed";

export interface ITask {
    _id?: string;
    title: string;
    description?: string;
    projectId: mongoose.Types.ObjectId;
    assignedMember?: mongoose.Types.ObjectId;
    dueDate: Date;
    priority: TaskPriority;
    status: TaskStatus;
    createdBy: mongoose.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}
