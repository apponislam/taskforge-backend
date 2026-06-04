import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import { jwtHelper } from "../../../utils/jwtHelper";
import config from "../../config";
import { User } from "./auth.model";
import bcrypt from "bcrypt";
import { IUser } from "./auth.interface";

const signup = async (payload: IUser) => {
    const isUserExist = await User.findOne({ email: payload.email });

    if (isUserExist) {
        throw new ApiError(httpStatus.BAD_REQUEST, "User already exists");
    }

    const newUser = await User.create(payload);
    return newUser;
};

const login = async (payload: any) => {
    const { email, password } = payload;

    const isUserExist = await User.findOne({ email }).select("+password");

    if (!isUserExist) {
        throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }

    const isPasswordMatched = await bcrypt.compare(password, isUserExist.password);

    if (!isPasswordMatched) {
        throw new ApiError(httpStatus.FORBIDDEN, "Password does not match");
    }

    const jwtPayload = {
        _id: isUserExist._id,
        name: isUserExist.name,
        email: isUserExist.email,
        role: isUserExist.role,
    };

    const accessToken = jwtHelper.generateToken(jwtPayload, config.jwt_access_secret as string, config.jwt_access_expire as string);

    const refreshToken = jwtHelper.generateToken(jwtPayload, config.jwt_refresh_secret as string, config.jwt_refresh_expire as string);

    // Create user object without password
    const user = {
        _id: isUserExist._id,
        name: isUserExist.name,
        email: isUserExist.email,
        role: isUserExist.role,
        createdAt: isUserExist.createdAt,
        updatedAt: isUserExist.updatedAt,
    };

    return {
        accessToken,
        refreshToken,
        user,
    };
};

const getAllUsers = async (page?: number, limit?: number, searchTerm?: string) => {
    const query: any = {};

    if (searchTerm) {
        query.name = { $regex: searchTerm, $options: "i" };
    }

    let usersQuery = User.find(query).select("-password").sort({ createdAt: -1 });

    if (page && limit) {
        const skip = (page - 1) * limit;
        usersQuery = usersQuery.skip(skip).limit(limit);
    }

    const users = await usersQuery;
    const total = await User.countDocuments(query);

    if (page && limit) {
        return {
            data: users,
            meta: {
                page,
                limit,
                total,
                totalPage: Math.ceil(total / limit),
            },
        };
    } else {
        return {
            data: users,
        };
    }
};

const seedDemoUsers = async () => {
    const demoUsers = [
        {
            name: "John Doe",
            email: "admin@demo.com",
            password: "123456",
            role: "admin",
        },
        {
            name: "Sarah Johnson",
            email: "manager@demo.com",
            password: "123456",
            role: "project_manager",
        },
        {
            name: "Mike Chen",
            email: "member@demo.com",
            password: "123456",
            role: "team_member",
        },
    ];

    for (const userData of demoUsers) {
        const existingUser = await User.findOne({ email: userData.email });
        if (!existingUser) {
            await User.create(userData);
        }
    }

    return { message: "Demo users seeded successfully" };
};

export const AuthServices = {
    signup,
    login,
    getAllUsers,
    seedDemoUsers,
};
