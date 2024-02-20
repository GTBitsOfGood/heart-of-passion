import mongoose from "mongoose";
import { z } from "zod";
import { donorSchema, SponsorLevel, Source, Status } from "~/common/types";

const { Schema } = mongoose;

export interface IDonor extends z.infer<typeof donorSchema> {
    _id: string;
    donorName: string;
    studentName: string;
    donorEmail: string;
    source: Source;
    sponsorLevel: SponsorLevel;
    status: Status;
}

export const sponsorLevelOptions = ["Platinum", "Gold", "Silver", "Star", "Bronze"];
export const statusOptions = ["Waiting for Reply", "Send Thank You Note", "Note Sent", "Send Email"];
export const sourceOptions = ["Event 1", "Event 2", "Event 3"];

const DonorSchema = new Schema<IDonor>(
    {
        _id: {
            type: String,
            required: true,
            auto: true,
        },
        donorName: {
            type: String,
            required: true,
        },
        studentName: {
            type: String,
            required: true,
        },
        donorEmail: {
            type: String,
            required: true,
            unique: true,
        },
        source: {
            type: String,
            enum: sourceOptions,
            default: "Event 1",
            required: true,
        },
        sponsorLevel: {
            type: String,
            enum: sponsorLevelOptions,
            required: true,
        },
        status: {
            type: String,
            enum: statusOptions,
            required: true,
        },

    },
    { _id: false },
);

const Donor: mongoose.Model<IDonor> = mongoose.models.Donor || mongoose.model("Donor", DonorSchema);
export { Donor };