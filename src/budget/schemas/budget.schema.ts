// src/budget/schemas/budget.schema.ts

import * as mongoose from 'mongoose';

export const BudgetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: String,
    price: Number,
  },
  { timestamps: true },
);
