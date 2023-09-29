import mongoose, { mongo } from "mongoose";
import { number } from "zod";

const { Schema } = mongoose;

export interface IEvent {
    retreatId: mongoose.Types.ObjectId;
    cost: number;
    name: string;
    location: string; //optional
    energyLevel: "low" | "medium" | "high"; //optoional
    category: "entertainment" | "educational" | "other"; //optoional
    dates: [Date],
    expenses: [object]
}

const EventSchema = new Schema<IEvent>({
    retreatId: {
        ref: "Retreat",
        type: Schema.Types.ObjectId,
        required: true,
    },
    cost: {
        type: Number
    },
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
    mongoose.model("Event", EventSchema);
