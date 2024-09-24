import bcrypt from "bcrypt";
import { Schema, model } from "mongoose";
import { TUser } from "./user.interface";
import config from "../../config";

const userSchema = new Schema<TUser>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        phone: { type: String, required: true },
        address: { type: String, required: true },
        role: {
            type: String,
            enum: ["admin", "user"],
            // required: true,
            default: "user",
        },
    },
    {
        timestamps: true,
        toJSON: {
            transform(doc, ret) {
                delete ret.password;
            },
        },
    },
);

userSchema.pre("save", async function (next) {
    this.password = await bcrypt.hash(this.password, Number(config.saltRound));
    next();
});

const User = model<TUser>("user", userSchema);

export default User;
