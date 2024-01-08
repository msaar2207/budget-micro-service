// src/budget/interfaces/budget.interface.ts

import mongoose, { Document } from 'mongoose';

export interface Budget extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  date: Date;
  transactionName: string;
  amount: number;
}
