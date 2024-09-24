import { TErrorSources, TGenericErrorResponse } from "../interface/error";
import mongoose from "mongoose";

const handleCastError = (err: mongoose.Error.CastError): TGenericErrorResponse => {
    const statusCode = 400;
    const errorSources: TErrorSources = [
        {
            path: err?.path,
            message: err?.message,
        },
    ];

    return {
        statusCode: statusCode,
        message: "Invalid ID",
        errorSources: errorSources,
    };
};

export default handleCastError;
