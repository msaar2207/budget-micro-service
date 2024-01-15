// src/budget/budget.service.ts

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Budget } from './interfaces/budget.interface';
import { TimeUnit } from '../common/enums/timeUnits';
import {
  startOfYear,
  subYears,
  endOfYear,
  startOfMonth,
  subMonths,
  endOfMonth,
  startOfDay,
  subDays,
  endOfDay,
  endOfQuarter,
  startOfQuarter,
  subQuarters,
  startOfWeek,
  endOfWeek,
  subWeeks,
} from 'date-fns';

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
    return this.budgetModel.find({ userId }).exec();
  }

  async findOne(userId: string, id: string): Promise<Budget> {
    return this.budgetModel.findOne({ _id: id, userId }).exec();
  }

  async update(
    userId: string,
    id: string,
    updateBudgetDto: any,
  ): Promise<Budget> {
    return this.budgetModel
      .findOneAndUpdate({ _id: id, userId }, updateBudgetDto, {
        new: true,
      })
      .exec();
  }

  async delete(userId: string, id: string): Promise<any> {
    return this.budgetModel.findOneAndDelete({ _id: id, userId }).exec();
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
    const query: any = { userId };

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

  async getBudgetTrends(
    userId: string,
    quantity: number,
    unit: TimeUnit,
  ): Promise<{ trends: Array<{ label: string; total: number }> }> {
    const currentDate = new Date();
    let trends = [];

    for (let i = 0; i < quantity; i++) {
      let startDate: Date, endDate, label;

      switch (unit) {
        case TimeUnit.Years:
          startDate = startOfYear(subYears(currentDate, i));
          endDate = endOfYear(subYears(currentDate, i));
          label = startDate.getFullYear().toString();
          break;
        case TimeUnit.Months:
          startDate = startOfMonth(subMonths(currentDate, i));
          endDate = endOfMonth(subMonths(currentDate, i));
          label = startDate.toLocaleString('default', {
            month: 'long',
            year: 'numeric',
          });
          break;
        case TimeUnit.Days:
          startDate = startOfDay(subDays(currentDate, i));
          endDate = endOfDay(subDays(currentDate, i));
          label = startDate.toLocaleDateString();
          break;

        case TimeUnit.Weeks:
          startDate = startOfWeek(subWeeks(currentDate, i), {
            weekStartsOn: 1,
          }); // Adjust weekStartsOn based on your locale
          endDate = endOfWeek(subWeeks(currentDate, i), { weekStartsOn: 1 });
          label = `Week of ${startDate.toLocaleDateString()}`;
          break;

        case TimeUnit.Quarters:
          startDate = startOfQuarter(subQuarters(currentDate, i));
          endDate = endOfQuarter(subQuarters(currentDate, i));
          label = `Q${Math.ceil(
            (startDate.getMonth() + 1) / 3,
          )} ${startDate.getFullYear()}`;
          break;
        default:
          throw new Error('Invalid time unit');
      }

      const trendData = await this.calculateTrend(
        userId,
        startDate,
        endDate,
        label,
      );

      trends.push(trendData);
    }

    // Reverse the array to start from the earliest to the most recent
    trends = trends.reverse();

    return { trends };
  }

  async calculateTrend(
    userId: string,
    startDate: Date,
    endDate: Date,
    label: string,
  ): Promise<{ label: string; total: number }> {
    const totalSpent = await this.budgetModel.aggregate([
      {
        $match: {
          userId,
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      { $group: { _id: null, total: { $sum: '$price' } } },
    ]);
    const total = totalSpent[0]?.total || 0;
    return { label, total };
  }
}
