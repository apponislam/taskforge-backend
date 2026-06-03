import mongoose, { Schema } from "mongoose";
import { IProject, ProjectStatus } from "./project.interface";

const ProjectSchema = new Schema<IProject>(
    {
        name: { type: String, required: [true, "Project name is required"], unique: true },
        description: { type: String },
        deadline: { type: Date, required: [true, "Project deadline is required"] },
        status: {
            type: String,
            enum: ["active", "completed", "on_hold"],
            default: "active",
        },
        createdBy: { type: Schema.Types.ObjectId, ref: "User", required: [true, "Created by user is required"] },
        teamMembers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

ProjectSchema.index({ createdBy: 1, status: 1 });

export const Project = mongoose.model<IProject>("Project", ProjectSchema);
