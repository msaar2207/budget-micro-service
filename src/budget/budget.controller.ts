// src/budget/budget.controller.ts

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { BudgetService } from './budget.service';

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
}
