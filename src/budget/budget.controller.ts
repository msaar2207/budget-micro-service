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
  HttpException,
} from '@nestjs/common';
import { BudgetService } from './budget.service';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { AuthenticatedRequest } from '../common/interfaces/express.interface';
import { TimeUnit } from 'src/common/enums/timeUnits';

@Controller('budget')
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createBudgetDto: any, @Req() req: AuthenticatedRequest) {
    const userId: string = req.user._id;
    return this.budgetService.create(userId, createBudgetDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
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
    const userId = req.user?._id;
    const trends = await this.budgetService.getBudgetTrends(
      userId,
      req.query.quantity as unknown as number,
      req.query.unit as TimeUnit,
    );
    return { trends };
  }
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.budgetService.findOne(req.user._id, id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() updateBudgetDto: any,
  ) {
    return this.budgetService.update(req.user._id, id, updateBudgetDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.budgetService.delete(req.user._id, id);
  }

  // Additional APIs
}
