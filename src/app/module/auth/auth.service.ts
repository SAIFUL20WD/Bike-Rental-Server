import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { TUser } from "../user/user.interface";
import User from "../user/user.model";
import bcrypt from "bcrypt";
import createToken from "./auth.util";
import config from "../../config";

const signUpUser = async (payLoad: TUser) => {
    const user = await User.create(payLoad);
    return user;
};

const LoginUser = async (email: string, password: string) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "No user exists with given email");
    }

    const passwordMatched = await bcrypt.compare(password, user?.password);
    if (!passwordMatched) {
        throw new AppError(httpStatus.FORBIDDEN, "Password does not match!");
    }

    const jwtPayload = { _id: user._id, name: user.name, email: user.email, role: user.role };

    const token = createToken(jwtPayload, config.jwtSecretKey as string, config.jwtExpiresIn as string);

    user.password = "";

    return { user, token };
};

export const AuthServices = {
    signUpUser,
    LoginUser,
};
