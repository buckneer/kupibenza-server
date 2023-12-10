import {NextFunction, Request, Response} from "express";
import {loginWithUsername, logout, refreshAccessToken, registerUser} from "../services/user.service";
import {UserDocument} from "../models/user.model";
import jwt from "jsonwebtoken";
import log from "../logger";
import { handleCustomError } from "../utils/errors";

export async function handleRegisterUser(req: Request, res: Response) {
	try {
		let user : UserDocument = {
			...req.body
		}

		let resp = await registerUser(user);

		//
		return res.send(JSON.stringify({"message": "Registered"}));
	} catch (e: any) {
		log.error(e.message);
		return res.status(409).send(e.message)
	}
}

export async function handleLogin(req: Request, res: Response) {
	try {
		let username = req.body.username
		let password = req.body.password;
		let userAgent = req.headers['user-agent'];
		if (userAgent) {
			let session = await loginWithUsername(username, password, userAgent)

			return res.send(JSON.stringify(session))
		}
		return res.status(401).send("User agent is required");
	} catch (e: any) {
		return handleCustomError(e, res);
	}
}

export async function handleRefresh(req: Request, res: Response) {
	try {
		let refreshToken = req.body.refresh_token;
		let userAgent = req.headers['user-agent'];

		if (userAgent) {
			let resp = await refreshAccessToken(refreshToken, userAgent);

			return res.send(JSON.stringify(resp))
		}

		return res.status(401).send("User agent is required");
	} catch (e: any) {
		log.error(e.message);
		return res.status(409).send(e.message)
	}
}

export async function handleLogout(req: Request, res: Response) {
	try {
		//@ts-ignore
		let username = req.user.username;
		let userAgent = req.headers['user-agent'];

		if(userAgent) {
			let logoutResp = await logout(username, userAgent);
			if (logoutResp) {
				return res.sendStatus(202);
			} else {
				return res.sendStatus(400);
			}
		} else {
			return res.sendStatus(400).send("User agent is required");
		}


	} catch (e: any) {
		log.error(e.message);
		return res.status(409).send(e.message)
	}
}

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
	const authHeader = req.headers['authorization'];
	if(authHeader) {
		const token = authHeader.split( " ")[1];
		if (token == null) return res.sendStatus(401);
		jwt.verify(token, process.env.JWT_SECRET as string, (err, user) => {
			if (err) return res.sendStatus(403);
			//@ts-ignore
			req.user = user;
			next();
		});
	} else {
		res.sendStatus(403);
	}
}

export const adminToken = async (req: Request, res: Response, next: NextFunction)=> {
    const authHeader = req.headers['authorization'];
	if(authHeader) {
		const token = authHeader.split( " ")[1];
		if (token == null) return res.sendStatus(401);
		jwt.verify(token, process.env.JWT_SECRET as string, (err, user) => {
			if (err) return res.sendStatus(403);
			//@ts-ignore
            if(user.role == "admin") {
                //@ts-ignore
                req.user = user;
			    next();
            } else {
                return res.sendStatus(401);
            }
		});
	} else {
		res.sendStatus(403);
	}
}
