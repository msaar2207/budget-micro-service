// src/budget/budget.service.ts

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Budget } from './interfaces/budget.interface';

@Injectable()
export class BudgetService {
  constructor(@InjectModel('Budget') private budgetModel: Model<Budget>) {}

  async create(createBudgetDto: any): Promise<Budget> {
    const createdBudget = new this.budgetModel(createBudgetDto);
    return createdBudget.save();
  }

  async findAll(): Promise<Budget[]> {
    return this.budgetModel.find().exec();
  }

  async findOne(id: string): Promise<Budget> {
    return this.budgetModel.findById(id).exec();
  }

  async update(id: string, updateBudgetDto: any): Promise<Budget> {
    return this.budgetModel
      .findByIdAndUpdate(id, updateBudgetDto, { new: true })
      .exec();
  }

  async delete(id: string): Promise<any> {
    return this.budgetModel.findByIdAndDelete(id).exec();
  }
}
