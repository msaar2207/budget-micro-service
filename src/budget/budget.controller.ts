// src/budget/budget.controller.ts

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpStatus,
  Req,
  UseGuards,
  HttpCode,
  HttpException,
} from '@nestjs/common';
import { BudgetService } from './budget.service';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { AuthenticatedRequest } from '../common/interfaces/express.interface';

@Controller('budget')
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) {}

  @Post()
  async create(@Body() createBudgetDto: any) {
    return this.budgetService.create(createBudgetDto);
  }

  @Get()
  async findAll() {
    return this.budgetService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.budgetService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateBudgetDto: any) {
    return this.budgetService.update(id, updateBudgetDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.budgetService.delete(id);
  }

  // Additional APIs

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get('entries')
  async getAllEntries(@Req() req: AuthenticatedRequest) {
    try {
      const { startDate, endDate, limit, skip, sort } = req.query;
      const userId = req.user._id;
      const entries = await this.budgetService.getAllEntries(
        userId,
        startDate as string,
        endDate as string,
        parseInt(limit as string),
        parseInt(skip as string),
        sort as string,
      );
      return entries;
    } catch (error) {
      throw new HttpException(
        'Error fetching entries',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('trends')
  async getBudgetTrends(@Req() req: AuthenticatedRequest) {
    const userId = req.user._id;
    const trends = await this.budgetService.getBudgetTrends(userId);
    return { trends };
  }
}
