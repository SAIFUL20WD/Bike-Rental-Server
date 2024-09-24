import { TErrorSources, TGenericErrorResponse } from "../interface/error";

const handleDuplicateError = (err: any): TGenericErrorResponse => {
    const statusCode = 400;

    const match = err?.message.match(/"([^"]*)"/);
    const extractedMessage = match && match[1];

    const errorSources: TErrorSources = [
        {
            path: "",
            message: `${extractedMessage} is already exists!`,
        },
    ];

    return {
        statusCode: statusCode,
        message: "Invalid ID",
        errorSources: errorSources,
    };
};

export default handleDuplicateError;
