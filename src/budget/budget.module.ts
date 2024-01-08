// src/budget/budget.module.ts

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BudgetController } from './budget.controller';
import { BudgetService } from './budget.service';
import { BudgetSchema } from './schemas/budget.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Budget', schema: BudgetSchema }]),
  ],
  controllers: [BudgetController],
  providers: [BudgetService],
})
export class BudgetModule {}
