import mongoose, { HydratedDocument } from "mongoose";
import { Count, ICount } from "../models/Count";

async function getGlobalCountDocument(): Promise<HydratedDocument<ICount>> {
  const record = await Count.findOne({}).exec();

  if (!record) {
    return await Count.create({ count: 0 });
  }

  return record;
}

export async function getGlobalCount(): Promise<number> {
  const record = await getGlobalCountDocument();
  return record.count;
}

export async function incrementGlobalCount(): Promise<void> {
  const record = await getGlobalCountDocument();
  record.count++;
  record.save();
}
