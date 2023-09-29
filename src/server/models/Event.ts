import mongoose, { mongo } from "mongoose";

const { Schema } = mongoose;

export interface IEvent {
    name: string;
    location: string; //optional
    energyLevel: "low" | "medium" | "high"; //optoional
    category: "entertainment" | "educational" | "other"; //optoional
    dates: [Date],
    expenses: [object]
}

const EventSchema = new Schema<IEvent>({
    name: {
        type: String,
    },
    location: {
        type: String,
    },
    energyLevel: {
        type: String,
        enum: ["low", "medium", "high"],
    },
    category: {
        type: String,
        enum: ["entertainment", "educational", "other"],
    },
    dates: {
        type: [Date],
        required: true
    },
    expenses: {
        type: [{
            name: {
                type: String,
                required: true
            },
            type: {
                type: String,
                enum: ["entertainment", "transportation", "other"],
                required: true
            },
            costType: {
                type: String,
                enum: ["per unit", "flat cost"],
                required: true
            },
            numberOfUnits: {
                type: Number,
                default: 1,
                required: true
            },
            notes: {
                type: String
            }
        }]
    }
});

export const Model =
    (mongoose.models.Event as mongoose.Model<IEvent>) ??
    mongoose.model("User", EventSchema);
