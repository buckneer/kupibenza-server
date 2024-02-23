import { CustomError } from "../utils/errors";
import Car, { CarDocument, CarProps } from "../models/car.model";


export const getAllCars = async () => {
    try {
        let cars = await Car.find({sold: false}).sort({ createdAt: 1 }) // Sort by createdAt field in descending order (-1 for descending)
        .exec() as CarDocument[];
        return cars;
    } catch(e: any) {
        return new Error(e);
    }
}

export const addCar = async (car: CarDocument) => {
    try {

        const newCar = new Car({...car});
        const savedCar = await newCar.save();
        if(savedCar) {
            return savedCar;
        } else {
            throw new CustomError("InternalError", "Internal server error");
        }
    } catch(e: any) {
        return new Error(e);
    }
}

export const filterCars = async (filters: Partial<CarDocument>) => {
    try {
        let filterObject: Record<string, any> = {};

        if ("minPrice" in filters || "maxPrice" in filters) {
            filterObject.price = {};

            if ("minPrice" in filters) {
                filterObject.price.$gte = filters.minPrice;
            }

            if ("maxPrice" in filters) {
                filterObject.price.$lte = filters.maxPrice;
            }
        }

        let propFilters = omitKeysFromObject(filters, ["minPrice", "maxPrice"]);

        for (const key in propFilters) {
            if (propFilters[key as keyof CarProps]) {
                filterObject[`props.${key}`] = propFilters[key as keyof CarProps];
            }
        }


        filterObject = {
            sold: false,
            ...filterObject
        }

        const filteredCars = await Car.find(filterObject) as CarDocument[];
        console.log(filterObject);
        return filteredCars;
        
    } catch(e: any) {
        return new Error(e);
    }
}

export const getById = async (carId: String) => {
    try {
        let carObj = await Car.findById(carId) as CarDocument;
        
        return carObj;
    } catch(e: any) {
        throw new Error(e);
    }
}

export const setSold = async (carId: String) => {
    try {
        let carObj = await Car.findById(carId) as CarDocument;
        carObj.sold = true;
        let saved = await carObj.save();

        return saved;
    } catch(e: any) {
        throw new Error(e);
    }
}

function omitKeysFromObject<T>(obj: Record<string, T>, keysToOmit: string[]): Record<string, T> {
    const result: Record<string, T> = { ...obj };

    keysToOmit.forEach((key) => {
        if (key in result) {
            delete result[key];
        }
    });

    return result;
}


