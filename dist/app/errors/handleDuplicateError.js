"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleDuplicateError = (err) => {
    const statusCode = 400;
    const match = err === null || err === void 0 ? void 0 : err.message.match(/"([^"]*)"/);
    const extractedMessage = match && match[1];
    const errorSources = [
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
exports.default = handleDuplicateError;
