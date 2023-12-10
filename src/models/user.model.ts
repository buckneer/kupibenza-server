import { Document, Schema, model } from "mongoose";

export interface UserDocument extends Document {
    username: string,
    password: string,
    email: string,
    role: string,
}

const UserSchema = new Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    role: {type: String, required: true}
})

const User = model<UserDocument>('User', UserSchema);

export default User;