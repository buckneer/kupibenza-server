import log from "../logger";
import {Request, Response} from 'express'
import { CarDocument } from "models/car.model";
import { addCar, filterCars, getAllCars, setSold } from "../services/car.service";

export const handleGetAllCars = async (req: Request, res: Response) => {
    try {
        let cars = await getAllCars();
        return res.send(JSON.stringify(cars));
    } catch(e: any) {
        log.error(e.message);
		return res.status(409).send(e.message)
    }
}

export const handleAddCar = async (req: Request, res: Response) => {
    try {
        let car = {
            ...req.body
        }

        const uploadedImages = req.files as Express.Multer.File[];

        const imagesData = uploadedImages.map((file) => ({
            filename: file.filename,
            path: file.path,
          }));
        
        let carDoc = {
            ...car,
            images: imagesData
        }
        
        let resp = await addCar(carDoc);
        return res.send(JSON.stringify(resp));
    } catch(e: any) {
        log.error(e.message);
		return res.status(409).send(e.message)
    }
}

export const handleFilterCars = async (req: Request, res: Response) => {
    try {

        let filters = {
            ...req.body
        }

        let cars = await filterCars(filters);
        return res.send(JSON.stringify(cars));
    } catch(e: any) {
        log.error(e.message);
		return res.status(409).send(e.message)
    }
}

export const handleSell =async (req:Request, res: Response) => {
    try {
        let carId = req.body.carId;
        let resp = await setSold(carId);

        return res.send(JSON.stringify(resp));
    } catch(e: any) {
        log.error(e.message);
        return res.status(409).send(e.message);
    }
}