import { User } from "./auth.model";
import config from "../../config";
import { IUser } from "./auth.interface";

export const seedAdmin = async () => {
    try {
        // Seed Admin
        const adminExists = await User.findOne({
            role: "admin",
        });

        if (!adminExists) {
            console.log("📝 No admin found, creating one...");

            const adminData: IUser = {
                name: "Admin User",
                email: config.superAdminEmail as string,
                password: config.superAdminPassword as string,
                role: "admin",
            };

            await User.create(adminData);

            console.log("✅ Admin created:", config.superAdminEmail);
        } else {
            console.log("✅ Admin already exists, skipping creation");
        }

        // Seed Project Manager
        const managerExists = await User.findOne({ email: "manager@demo.com" });
        if (!managerExists) {
            console.log("📝 No project manager found, creating one...");
            const managerData: IUser = {
                name: "Project Manager",
                email: "manager@demo.com",
                password: "manager123",
                role: "project_manager",
            };
            await User.create(managerData);
            console.log("✅ Project Manager created: manager@demo.com");
        }

        // Seed Team Member
        const memberExists = await User.findOne({ email: "member@demo.com" });
        if (!memberExists) {
            console.log("📝 No team member found, creating one...");
            const memberData: IUser = {
                name: "Team Member",
                email: "member@demo.com",
                password: "member123",
                role: "team_member",
            };
            await User.create(memberData);
            console.log("✅ Team Member created: member@demo.com");
        }

        console.log("✅ All demo users seeded successfully!");

    } catch (error) {
        console.error("❌ Error seeding users:", error);
    }
};
