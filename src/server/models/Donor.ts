import mongoose from "mongoose";

const { Schema } = mongoose;

export interface IDonor {
    _id: string;
    donorName: string;
    studentName: string;
    donorEmail: string;
    source: "Event 1" | "Event 2" | "Event 3";
    sponsorLevel: "Platinum" | "Gold" | "Silver" | "Star" | "Bronze"
}

export const sponsorLevelOptions = ["Platinum", "Gold", "Silver", "Star", "Bronze"];

const DonorSchema = new Schema<IDonor>(
    {
        _id: {
            type: String,
            required: true,
            auto: true,
        },
        donorName: {
            type: String,
        },
        studentName: {
            type: String,
        },
        donorEmail: {
            type: String,
            required: true,
            unique: true,
        },
        source: {
            type: String,
            enum: ["Event 1", "Event 2", "Event 3"],
            default: "Event 1",
            required: true,
        },
        sponsorLevel: {
            type: String,
            enum: sponsorLevelOptions,
            required: true,
        },

    },
    { _id: false },
);

export const DonorModel =
    (mongoose.models.Donor as mongoose.Model<IDonor>) ??
    mongoose.model("Donor", DonorSchema);
