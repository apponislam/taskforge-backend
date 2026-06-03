import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import config from "../../config";
import { Request, Response } from "express";
import { AuthServices } from "./auth.services";

const signup = catchAsync(async (req: Request, res: Response) => {
    const result = await AuthServices.signup(req.body);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "User signed up successfully",
        data: result,
    });
});

const login = catchAsync(async (req: Request, res: Response) => {
    const result = await AuthServices.login(req.body);

    res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: config.node_env === "production",
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User logged in successfully",
        data: result,
    });
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
    const page = req.query.page ? Number(req.query.page) : undefined;
    const limit = req.query.limit ? Number(req.query.limit) : undefined;
    const searchTerm = Array.isArray(req.query.searchTerm) ? (req.query.searchTerm[0] as string) : (req.query.searchTerm as string) || undefined;

    const result = await AuthServices.getAllUsers(page, limit, searchTerm);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Users fetched successfully",
        meta: (result as any).meta,
        data: result.data,
    });
});

const seedDemoUsers = catchAsync(async (req: Request, res: Response) => {
    const result = await AuthServices.seedDemoUsers();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Demo users seeded successfully",
        data: result,
    });
});

export const AuthControllers = {
    signup,
    login,
    getAllUsers,
    seedDemoUsers,
};
