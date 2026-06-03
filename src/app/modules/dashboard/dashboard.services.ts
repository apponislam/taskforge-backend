import { Project } from "../project/project.model";
import { Task } from "../task/task.model";
import { User } from "../auth/auth.model";

const getDashboardStats = async () => {
    const [totalProjects, totalTasks, completedTasks, pendingTasks, overdueTasks] = await Promise.all([Project.countDocuments(), Task.countDocuments(), Task.countDocuments({ status: "completed" }), Task.countDocuments({ status: { $ne: "completed" } }), Task.countDocuments({ status: { $ne: "completed" }, dueDate: { $lt: new Date() } })]);

    const tasksByPriority = await Task.aggregate([
        {
            $group: {
                _id: "$priority",
                count: { $sum: 1 },
            },
        },
    ]);

    const tasksByStatus = await Task.aggregate([
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 },
            },
        },
    ]);

    const projects = await Project.find().sort({ createdAt: -1 }).populate("createdBy teamMembers").limit(10);

    // Get project summaries with task counts
    const projectsWithTaskCounts = await Promise.all(
        projects.map(async (project) => {
            const totalTasksCount = await Task.countDocuments({ projectId: project._id });
            const completedTasksCount = await Task.countDocuments({ projectId: project._id, status: "completed" });
            const progress = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;

            return {
                ...project.toObject(),
                totalTasks: totalTasksCount,
                pendingTasks: totalTasksCount - completedTasksCount,
                progress,
            };
        }),
    );

    // Get upcoming deadlines
    const upcomingDeadlines = await Project.find({
        deadline: { $gte: new Date() },
        status: { $ne: "completed" },
    })
        .sort({ deadline: 1 })
        .limit(5)
        .populate("createdBy teamMembers");

    // Get high priority pending tasks
    const highPriorityTasks = await Task.find({
        priority: "high",
        status: { $ne: "completed" },
    })
        .populate("projectId assignedMember")
        .sort({ dueDate: 1 })
        .limit(10);

    // Member workload summary
    const members = await User.find().select("-password");
    const memberWorkload = await Promise.all(
        members.map(async (member) => {
            const totalTasksCount = await Task.countDocuments({ assignedMember: member._id });
            const completedTasksCount = await Task.countDocuments({ assignedMember: member._id, status: "completed" });
            const pendingTasksCount = totalTasksCount - completedTasksCount;

            return {
                ...member.toObject(),
                totalTasks: totalTasksCount,
                completedTasks: completedTasksCount,
                pendingTasks: pendingTasksCount,
            };
        }),
    );

    return {
        totalProjects,
        totalTasks,
        completedTasks,
        pendingTasks,
        overdueTasks,
        tasksByPriority,
        tasksByStatus,
        projects: projectsWithTaskCounts,
        upcomingDeadlines,
        highPriorityTasks,
        memberWorkload,
    };
};

export const DashboardServices = {
    getDashboardStats,
};
