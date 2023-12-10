import { authenticateToken, handleLogin, handleLogout, handleRefresh, handleRegisterUser } from "./controllers/user.controller";
import { handleAddCar, handleFilterCars, handleGetAllCars, handleSell } from "./controllers/car.controller";
import {Express, request, Request, Response} from "express";
import upload from "./middleware/multerConfig";
import log from "logger";

export default function (app: Express) {
	app.get("/healthcheck", (request: Request, response: Response) => response.sendStatus(200))

	app.get("/cars", handleGetAllCars);
	app.post("/car", authenticateToken, upload.array("images", 10), handleAddCar);
	app.get("/car/filter", handleFilterCars);
	app.delete("/car/sell", authenticateToken, handleSell);

	app.post("/register", authenticateToken, handleRegisterUser);
	app.post("/login", handleLogin);
	app.post("/refresh", handleRefresh);
	app.get("/protected", authenticateToken, (request: Request, response: Response) => response.sendStatus(200));
	app.delete("/logout", authenticateToken, handleLogout);
	
}
