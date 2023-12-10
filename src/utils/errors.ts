import {Response} from 'express';

export class CustomError extends Error {
    readonly name: string; // Define a 'name' property for the error name
    constructor(name: string, message: string) {
        super(message);
        this.name = name; // Set the error name
        Object.setPrototypeOf(this, CustomError.prototype);
    }
}


export function handleCustomError(e: any, res: Response) {
    const errorMap: Record<string, { status: number, message: string }> = {
        "InvalidCredentialsError": { status: 401, message: "Invalid credentials" },
        "DatabaseError": { status: 500, message: "Database error" },
        "ValidationError": { status: 422, message: "Validation error" },
        "InternalError": { status: 500, message: "Internal server error" }
        // Add more error types and their corresponding status codes and messages as needed
    };

    const defaultError = { status: 500, message: "Internal server error" };

    const errorInfo = errorMap[e.name] || defaultError;
    const { status, message } = errorInfo;

    return res.status(status).send(message + ": " + e.message);
}