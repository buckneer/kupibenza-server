import {UserDocument} from "./src/models/user.model";
import jwt from "jsonwebtoken";

declare namespace Express {
	export interface Request {
		user?: string | jwt.JwtPayload // I use string for example, you can put other type
	}
}
