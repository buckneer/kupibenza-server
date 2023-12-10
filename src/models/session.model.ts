import {Document, Schema, Types, model} from 'mongoose'

export interface SessionDocument extends Document {
    userId: Types.ObjectId,
	refreshToken: string,
	active: boolean,
	userAgent: string
}

const SessionSchema = new Schema({
	userId: String,
	refreshToken: String,
	active: Boolean,
	userAgent: String
})

const Session = model("Session", SessionSchema);

export default Session;