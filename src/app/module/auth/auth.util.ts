import jwt from "jsonwebtoken";
import { Types } from "mongoose";

const createToken = (jwtPayload: { _id: Types.ObjectId; role: string }, secret: string, expiresIn: string) => {
    const token = jwt.sign(jwtPayload, secret, { expiresIn });
    return token;
};

export default createToken;
