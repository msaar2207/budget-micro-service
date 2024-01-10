// src/budget/budget.service.ts

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Budget } from './interfaces/budget.interface';
import { subMonths, startOfMonth, endOfMonth } from 'date-fns';

@Injectable()
export class BudgetService {
  constructor(@InjectModel('Budget') private budgetModel: Model<Budget>) {}

  async create(userId: string, createBudgetDto: any): Promise<Budget> {
    const createdBudget = new this.budgetModel({
      ...createBudgetDto,
      userId,
    });
    return createdBudget.save();
  }

  async findAll(userId: string): Promise<Budget[]> {
    return this.budgetModel.find({ user: userId }).exec();
  }

  async findOne(userId: string, id: string): Promise<Budget> {
    return this.budgetModel.findOne({ _id: id, user: userId }).exec();
  }

  async update(
    userId: string,
    id: string,
    updateBudgetDto: any,
  ): Promise<Budget> {
    return this.budgetModel
      .findOneAndUpdate({ _id: id, user: userId }, updateBudgetDto, {
        new: true,
      })
      .exec();
  }

  async delete(userId: string, id: string): Promise<any> {
    return this.budgetModel.findOneAndDelete({ _id: id, user: userId }).exec();
  }

  // Additional Methods

  async getAllEntries(
    userId: string,
    startDate?: string | any,
    endDate?: string | any,
    limit?: number,
    skip?: number,
    sort?: string | any,
  ): Promise<Budget[]> {
    const query: any = { 'userId.$oid': userId };

    if (startDate && endDate) {
      query.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const options: any = {};

    if (limit) options.limit = limit;
    if (skip) options.skip = skip;
    if (sort) {
      const [field, direction] = sort.split(':');
      options.sort = { [field]: direction === 'desc' ? -1 : 1 };
    }

    return this.budgetModel.find(query, null, options).exec();
  }

  async getBudgetTrends(userId: string): Promise<any[]> {
    const currentDate = new Date();
    const lastMonth = subMonths(currentDate, 1);
    const last6Months = subMonths(currentDate, 6);
    const last12Months = subMonths(currentDate, 12);

    const [lastMonthData, last6MonthsData, last12MonthsData] =
      await Promise.all([
        this.calculateTrend(
          userId,
          startOfMonth(lastMonth),
          endOfMonth(lastMonth),
          'Last Month',
        ),
        this.calculateTrend(
          userId,
          startOfMonth(last6Months),
          currentDate,
          'Last 6 Months',
        ),
        this.calculateTrend(
          userId,
          startOfMonth(last12Months),
          currentDate,
          'Last 12 Months',
        ),
      ]);

    return [lastMonthData, last6MonthsData, last12MonthsData];
  }

  private async calculateTrend(
    userId: string,
    startDate: Date,
    endDate: Date,
    label: string,
  ): Promise<{ label: string; total: number }> {
    const totalSpent = await this.budgetModel.aggregate([
      {
        $match: { user: userId, createdAt: { $gte: startDate, $lte: endDate } },
      },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const total = totalSpent[0]?.total || 0;
    return { label, total };
  }
}
