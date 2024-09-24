import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { UserServices } from "./user.service";

const getAllUser = catchAsync(async (req, res) => {
    const result = await UserServices.getAllUserFromDB();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Users retrieved successfully",
        data: result,
    });
});

const getUser = catchAsync(async (req, res) => {
    const { _id: userId } = req.user;
    const result = await UserServices.getUserFromDB(userId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User profile retrieved successfully",
        data: result,
    });
});

const updateUser = catchAsync(async (req, res) => {
    const { _id: userId } = req.user;
    const result = await UserServices.updateUserIntoDB(userId, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Profile updated successfully",
        data: result,
    });
});

const updateUserById = catchAsync(async (req, res) => {
    const userId = req.params.id;
    const result = await UserServices.updateUserByIdIntoDB(userId, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User updated successfully",
        data: result,
    });
});

const deleteUser = catchAsync(async (req, res) => {
    const userId = req.params.id;
    const result = await UserServices.deleteUserFromDB(userId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User deleted successfully",
        data: result,
    });
});

export const UserControllers = {
    getAllUser,
    getUser,
    updateUser,
    updateUserById,
    deleteUser,
};
