import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthServices } from "./auth.service";

const signUpUser = catchAsync(async (req, res) => {
    const result = await AuthServices.signUpUser(req.body);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "User registered successfully",
        data: result,
    });
});

const loginUser = catchAsync(async (req, res) => {
    const { email, password } = req.body;

    const result = await AuthServices.LoginUser(email, password);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User logged in successfully",
        token: result?.token,
        data: result?.user,
    });
});

export const AuthControllers = {
    signUpUser,
    loginUser,
};
