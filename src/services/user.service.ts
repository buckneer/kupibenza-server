import User, { UserDocument } from "../models/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config"
import Session, { SessionDocument } from "../models/session.model";
import logger from "../logger";
import { CustomError } from "../utils/errors";

export const registerUser = async (user: UserDocument) => {
    try {
		let userExists= await User.findOne({"$or": [{email: user.email}, {username: user.username}]});

		if (userExists) {
			throw new CustomError("ValidationError", "User Already Exists");
		} else {
			user.password = await bcrypt.hash(user.password, 10);
			const newUser = new User({...user});
			const registered = await newUser.save();
			return {"message": "User created"};
		}
	} catch (e: any) {
		if (e.name === 'MongoError') {
            throw new CustomError("DatabaseError", "Database error: " + e.message);
        } else if (e.name === 'ValidationError') {
            throw new CustomError("ValidationError", "Validation error: " + e.message);
        } else if (e.name === 'InvalidCredentialsError') {
			throw new CustomError("InvalidCredentialsError", e.message);
		}else {
            throw new CustomError("InternalError", "Internal server error");
        }
	}
}

export async function loginWithUsername(username: string, password: string, userAgent: string) {
	try {
		const user = await User.findOne({username: username});
		if (user) {
			let matchingPass = await bcrypt.compare(password, user.password);
			if (matchingPass) {
				const accessToken = jwt.sign({username: user.username, role: user.role}, process.env.JWT_SECRET as string, {expiresIn: "20m"});
				const refreshToken = jwt.sign({username: user.username, role: user.role},
					process.env.REFRESH_SECRET as string);

				let session = {
					userId: user._id,
					refreshToken: refreshToken,
					active: true,
					userAgent: userAgent
				}

				let newSession = new Session(session);
				let saved = await newSession.save();
				logger.info(saved);

				return {
					"access_token": accessToken,
					"refresh_token": refreshToken
				}



			} else {
				throw new CustomError("InvalidCredentialsError", "Username or password incorrect");
				
			}
		} else {
			// return {"message": "Username or password incorrect"}
			throw new CustomError("InvalidCredentialsError", "Username and password are required");
		}
	} catch (e: any) {
		if (e.name === 'MongoError') {
            throw new CustomError("DatabaseError", e.message);
        } else if (e.name === 'ValidationError') {
            throw new CustomError("ValidationError", e.message);
        } else if (e.name === 'InvalidCredentialsError') {
			throw new CustomError("InvalidCredentialsError", e.message);
		}else {
            throw new CustomError("InternalError", "Internal server error");
        }
	}
}

export async function refreshAccessToken(refreshToken: string, userAgent: string) {
	try {
		let session = await Session.findOne({refreshToken, "active": true, userAgent})
		if(session) {
			let decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET as string);
			if (decoded) {
				//@ts-ignore
				let user = await User.findOne({username: decoded.username});
				if (user) {
					const accessToken = jwt.sign({username: user.username, role: user.role}, process.env.JWT_SECRET as string, {expiresIn: "20m"});
					return {"access_token": accessToken};
				} else {
					throw new CustomError("ValidationError", "User Already Exists");
				}
			} else {
				throw new CustomError("ValidationError", "Refresh token invalid");
			}

		} else {
			throw new CustomError("ValidationError", "Refresh token invalid");
		}
	} catch (e: any) {
		if (e.name === 'MongoError') {
            throw new CustomError("DatabaseError", "Database error: " + e.message);
        } else if (e.name === 'ValidationError') {
            throw new CustomError("ValidationError", "Validation error: " + e.message);
        } else if (e.name === 'InvalidCredentialsError') {
			throw new CustomError("InvalidCredentialsError", e.message);
		}else {
            throw new CustomError("InternalError", "Internal server error");
        }
	}
}

export async function logout(username: string, userAgent: string) {
	try {
		let user = await User.findOne({username});
		if (user) {
			let session = await Session.findOne({"userId": user._id, userAgent});
			if (session) {
				session.active = false;
				await session.save();
				return {"message": "Logged out successfully"};
			} else {
				throw new CustomError("ValidationError", "Session Expired");
			}
		} else {
			throw new CustomError("ValidationError", "This user doesn't exist");
		}

	} catch (e: any) {
		if (e.name === 'MongoError') {
            throw new CustomError("DatabaseError", "Database error: " + e.message);
        } else if (e.name === 'ValidationError') {
            throw new CustomError("ValidationError", "Validation error: " + e.message);
        } else if (e.name === 'InvalidCredentialsError') {
			throw new CustomError("InvalidCredentialsError", e.message);
		}else {
            throw new CustomError("InternalError", "Internal server error");
        }
	}
}


