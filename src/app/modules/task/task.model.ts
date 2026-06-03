import mongoose, { Schema } from "mongoose";
import { ITask, TaskPriority, TaskStatus } from "./task.interface";

const TaskSchema = new Schema<ITask>(
    {
        title: { type: String, required: [true, "Task title is required"] },
        description: { type: String },
        projectId: { type: Schema.Types.ObjectId, ref: "Project", required: [true, "Project is required"] },
        assignedMember: { type: Schema.Types.ObjectId, ref: "User" },
        dueDate: { type: Date, required: [true, "Due date is required"] },
        priority: {
            type: String,
            enum: ["high", "medium", "low"],
            default: "medium",
        },
        status: {
            type: String,
            enum: ["todo", "in_progress", "completed"],
            default: "todo",
        },
        createdBy: { type: Schema.Types.ObjectId, ref: "User", required: [true, "Created by user is required"] },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

TaskSchema.index({ projectId: 1, title: 1 }, { unique: true });
TaskSchema.index({ projectId: 1, status: 1, priority: 1 });
TaskSchema.index({ assignedMember: 1 });

export const Task = mongoose.model<ITask>("Task", TaskSchema);
