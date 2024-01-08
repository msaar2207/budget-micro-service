// src/budget/schemas/budget.schema.ts

import * as mongoose from 'mongoose';

export const BudgetSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId, // Reference to the User
  transactionName: String,
  amount: Number,
});
