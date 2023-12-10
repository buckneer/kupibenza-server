import {Document, model, Schema} from 'mongoose';

export interface CarImage {
    filename: string;
    path: string;
}

export interface CarProps {
    condition?: string;
    type?: string;
    manufacturer?: string;
    model?: string;
    year?: string;
    drive?: string;
    transmission?: string;
    fuel?: string;
    km?: string;
    engineSize?: string;
    cylinders?: string;
    color?: string;
    doors?: string;
    vin?: string;
}

export interface CarDocument extends Document {
    name: string;
    price: number;
    description: string;
    sold: boolean;
    props: CarProps;
    addOns: Array<string>;
    images: CarImage[];
}

const CarSchema = new Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    sold: {type: Boolean, required: true},
    props: {
        manufacturer: { type: String },
        model: { type: String },
        color: { type: String },
        drive: { type: String },
        transmission: { type: String },
        condition: { type: String },
        year: { type: String },
        km: { type: String },
        fuel: { type: String },
        engineSize: { type: String },
        doors: { type: String },
        type: {type: String},
        cylinders: {type: String}

    },
    addOns: [{ type: String }],
    images: [
        {
          filename: { type: String },
          path: { type: String },
        },
    ],

})

const Car = model<CarDocument>("Car", CarSchema);

export default Car;