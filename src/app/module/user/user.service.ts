import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { TUser } from "./user.interface";
import User from "./user.model";

const getAllUserFromDB = async () => {
    const users = await User.find();
    return users;
};

const getUserFromDB = async (userId: string) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }
    return user;
};

const updateUserIntoDB = async (userId: string, payLoad: Partial<TUser>) => {
    const user = await User.findByIdAndUpdate(userId, payLoad, { new: true });
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }
    return user;
};

const updateUserByIdIntoDB = async (userId: string, payLoad: Partial<TUser>) => {
    const user = await User.findByIdAndUpdate(userId, payLoad, { new: true });
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }
    return user;
};

const deleteUserFromDB = async (userId: string) => {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }
    return user;
};

export const UserServices = {
    getAllUserFromDB,
    getUserFromDB,
    updateUserIntoDB,
    updateUserByIdIntoDB,
    deleteUserFromDB,
};
