export type User = {
  name: string;
  email: string;
  role: string;
  chapter?: string;
}

export type Chapter = {
  name: string;
}

export enum EnergyLevel {
  Low = 'low',
  Medium = 'medium',
  High = 'high'
}

export enum Category {
  Entertainment = 'entertainment',
  Educational = 'educational',
  Other = 'other'
}

export enum ExpenseType {
  Entertainment = 'entertainment',
  Transportation = 'transportation',
  Other = 'other'
}

export enum CostType {
  PerUnit = 'per unit',
  FlatCost = 'flat cost'
}

export interface DateObject {
  day: number;
  from: string;
  to: string;
}

export interface ExpenseObject {
  name: string;
  type: ExpenseType;
  costType: CostType;
  numberOfUnits?: number;
  notes?: string;
}

export type Event = {
  name: string;
  location?: string;
  energyLevel?: EnergyLevel;
  category?: Category;
  dates: DateObject[];
  expenses: ExpenseObject[];
}